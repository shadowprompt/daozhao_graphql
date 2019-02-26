const path = require('path')
const router = require('express').Router();
const webpush = require('web-push');
const {
  time2Str
} = require('../util');
const {
  requestPayload,
  timeoutPromise,
  nodeStore
} = require('../util');
const localStorage = nodeStore('../localStorage/push-service');
const {
  PUSH_PUBLIC_KEY,
  PUSH_PRIVATE_KEY
} = require('../config');

console.log(PUSH_PUBLIC_KEY, PUSH_PRIVATE_KEY);
// 设置web-push的VAPID值
webpush.setVapidDetails(
  'mailto:huixiong.cn@gmail.com',
  PUSH_PUBLIC_KEY,
  PUSH_PRIVATE_KEY
);

function pushMessage(subscription, data = {}) {

  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  // maybe timeout becasue of the GFW. For example, google fcm push service
  return Promise.race([webpush.sendNotification(subscription, data), timeoutPromise(10000)]);
}

router.get('/', function (req, res) {
  const pushPromises = localStorage._keys.map(key => JSON.parse(localStorage.getItem(key)).subscription)
    .map(subscription => pushMessage(subscription, {
      title: 'daozhao'
    }));
  Promise.all(pushPromises).then(list => {
    const result = list.map(item => item.statusCode);
    console.log('push service的相应数据:', result);
    res.send({
      success: true,
      count: result.length,
    });
  }).catch(errs => {
    console.log('errs', errs)
    res.send({
      success: false,
    });
  });
});

router.post('/', function (req, res) {
  const {
    body
  } = req;
  const pushPromises = localStorage._keys.map(key => JSON.parse(localStorage.getItem(key)).subscription)
    .map(subscription => pushMessage(subscription, body));
  Promise.all(pushPromises).then(list => {
    console.log('push service的相应数据:', list);
    res.send({
      success: true,
      count: list.length,
    });
  }).catch(errs => {
    console.log('errs', errs)
    res.send({
      success: false,
    });
  });
});

router.post('/list', function (req, res) {
  const subscriptions = localStorage._keys.map(key => {
    const {
      subscription,
      updateTime
    } = JSON.parse(localStorage.getItem(key));
    return {
      subscription,
      updateTime: time2Str(updateTime),
    };
  });
  res.send({
    success: true,
    count: subscriptions.length,
    subscriptions,
  });
});


router.get('/list', function (req, res) {
  const subscriptions = localStorage._keys.map(key => {
    const {
      subscription,
      updateTime
    } = JSON.parse(localStorage.getItem(key));
    return {
      subscription,
      updateTime: time2Str(updateTime),
    };
  });
  res.send({
    success: true,
    count: subscriptions.length,
    subscriptions,
  });
});

router.post('/subscribe', function (req, res) {
  requestPayload(req).then(result => {
    console.log('requestPayload', result);
    const {
      subscribe,
      subscription
    } = JSON.parse(result);

    if (subscription) {
      const {
        keys: {
          auth
        } = {}
      } = subscription;
      if (subscribe) {
        console.log(`subscribe ${auth}`)
        auth && localStorage.setItem(auth, JSON.stringify({
          ...JSON.parse(result),
          updateTime: Date.now(),
        }));
      } else {
        console.log(`unsubscribe ${auth}`)
        auth && localStorage.removeItem(auth);
      }
    }
    res.send({
      success: true,
    });
  }).catch(err => res.send({
    success: false,
  }));
});

router.post('/clear', function (req, res) {
  const count = localStorage._keys.length;
  localStorage._keys.forEach(key => localStorage.removeItem(key));
  res.send({
    success: true,
    count,
  });
});



module.exports = router
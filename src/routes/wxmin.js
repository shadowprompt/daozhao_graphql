const path = require('path')
const axios = require('axios');
const router = require('express').Router();
const {
  nodeStore,
  getWXAccessToken,
  JWTDecode,
} = require('../util');

const {
  WXMIN_APPID,
  WXMIN_APPSECRET,
  WXMIN_API_URL
} = require('../config/index');

//
router.post('*', (req, res, next) => {
  const {
    authorization
  } = req.headers;
  console.log('authorization', authorization);
  const parsedAuth = authorization && JWTDecode(authorization, false);
  console.log('parsedAuth ', parsedAuth);
  req.body.openId = parsedAuth && parsedAuth.payload.openId || ''; // 将用户的openId挂载到req.body上面
  next();
});

router.post('/decryptData', async (req, res) => {
  const {
    encryptedData,
    iv,
    sessionKey,
  } = req.body;
  try {
    const decryptData = util.decryptData(encryptedData, iv, sessionKey, WXMIN_APPID);
    res.send(decryptData);
  } catch (e) {
    res.send({
      success: false,
    })
  }
});

router.post('/login', async (req, res) => {
  const {
    code,
    encryptedData,
    iv
  } = req.body;

  const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
    params: {
      appid: WXMIN_APPID,
      secret: WXMIN_APPSECRET,
      js_code: code,
      grant_type: 'authorization_code',
    }
  });
  console.log('data-', response.data);
  const {
    openid: openId,
    session_key: sessionKey
  } = response.data;

  // decrypt 解码用户信息
  try {
    const {
      watermark,
      ...userInfo
    } = util.decryptData(encryptedData, iv, sessionKey, WXMIN_APPID);
    console.log('userInfo', userInfo);
    await axios.post('http://localhost:5050/graphql', {
      query: queryStr.updateUser,
      variables: userInfo,
    }).then(result => {
      console.log('graphql 成功', Date.now());
    }).catch(err => console.log('query graphql err ', err));

    res.send({
      data: util.JWTSign({
        openId,
        expiresIn: 60 * 60 * 1
      }),
    });
  } catch (e) {
    res.sendStatus(500);
    return;
  }
});

router.post('/verify', (req, res) => {
  let token = req.body.token || req.query.token || req.headers.token;
  const test = jwt.decode(token, {
    complete: true,
  });
  console.log('test', test);

  const result = jwt.verify(token, key, (err, decode) => {
    if (err) {
      res.json({
        responseCode: 403,
        errMsg: '失效',
      })
    } else {

      res.send('ok');
    }
  });
});


// 供微信服务器测试接口地址合法
router.get('/push', (req, res) => {
  const {
    echostr
  } = req.query;
  res.send(echostr);
});

router.post('/push', async (req, res) => {
  const {
    access_token
  } = await getWXAccessToken(res);
  if (!access_token) {
    return;
  }
  axios.post(`${WXMIN_API_URL}/cgi-bin/message/wxopen/template/send?access_token=${access_token}`, req.body).then(result => {
    res.send(result.data);
    axios.post('http://localhost:5050/push', result.data).catch(err => console.log('推送微信反馈失败', err));
  }).catch(err => res.sendStatus(502));
});

router.post('/pushAll', async (req, res) => {
  const {
    access_token
  } = await getWXAccessToken(res);
  if (!access_token) {
    return;
  }
  const {
    template_id,
    form_id
  } = req.body;
  const users = await axios.post('http://localhost:5050/graphql', {

  })
  const url = `${WXMIN_API_URL}/cgi-bin/message/wxopen/template/send?access_token=${access_token}`;
  Promise.all([
    axios.post(url, {
      template_id,
      form_id,
      touser: 'oHS780PjvytIufPoDFKbftrh9N_4',
      data: {
        "keyword1": {
          "value": "测试数据一",
          "color": "#173198"
        },
        "keyword2": {
          "value": "测试数据二",
          "color": "#173177"
        }
      },
    }), axios.post(url, {
      template_id,
      form_id: "59708635fbbeea5b1db01b68b2b9cb35",
      touser: 'oHS780MuBJVFM22yJt6bZAI5RTPM',
      data: {
        "keyword3": {
          "value": "测试数据三",
          "color": "#173177"
        },
        "keyword4": {
          "value": "测试数据四",
          "color": "#173111"
        },
      }
    })
  ]).then(result => {
    console.log('pushAll result', result);
    res.send({
      success: true,
    });
  }).catch(err => res.sendStatus(502));
});

// 返回小程序appId, appSecret
router.post('/getAppSecret', (req, res) => {
  res.send({
    appId: WXMIN_APPID,
    appSecret: WXMIN_APPSECRET,
  });
});

// 获取小程序access_token
router.post('/getAccessToken', (req, res) => new Promise((resolve, reject) => {
  getWXAccessToken(res).then(result => {
    resolve(result);
    res.send(result);
  }).catch(err => {
    reject(err);
    res.send(err);
  });
}));

// 获取小程序access_token
router.post('/getAccessTokenDirect', (req, res) => new Promise((resolve, reject) => {
  getWXAccessToken(res, true).then(result => {
    resolve(result);
    res.send(result);
  }).catch(err => {
    reject(err);
    res.send(err);
  });
}));

// 获取小程序模板列表
router.post('/getTemplateList', async (req, res) => {
  const {
    access_token
  } = await getWXAccessToken(res);
  if (access_token) {
    axios.post(`https://api.weixin.qq.com/cgi-bin/wxopen/template/list?access_token=${access_token}`, {
      access_token,
      offset: 0,
      count: 10,
    }).then(result => {
      console.log('result', result.data);
      res.send(result.data);
    }).catch(err => {
      console.log('err', err, err.statusCode);
      res.sendStatus(502);
    });
  }
});

module.exports = router
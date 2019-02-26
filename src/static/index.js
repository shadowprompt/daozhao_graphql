const socket = io();

let swRegistration;
let isSubscribed = false;
const applicationServerPublicKey = 'BGwZ7R1oOio1xs61Jgm34qguAKsU2w96XrSs22TpK-yK9goD0Qidfp7tpjDvG8T1Zu4vdKJp_Ev93U0iWPRmP9c';

const manifestUrl = "/manifest";
fetch(manifestUrl).then(res => res.json()).then(data => {
  console.log('data', data)
  const stringManifest = JSON.stringify(data);
  const blob = new Blob([stringManifest], {
    type: 'application/json'
  });
  const manifestURL = URL.createObjectURL(blob);
  const manifestDom = document.querySelector('#manifest');
  if (manifestDom) {
    manifestDom.setAttribute('href', manifestURL);
  }
}).catch(err => console.log('err', err));

const pushButton = document.getElementById('btn');
const testButton = document.getElementById('test');

testButton.addEventListener('click', (e) => {
  let img = new Image();
  img.src = '/static/zhan.jpg';
  document.body.appendChild(img);
})

socket.on('message', function (msg) {
  console.log('message: ' + msg);
});
socket.on('disconnect', () => {
  console.log('disconnect')
});

if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((swReg) => {
        swRegistration = swReg;

        initializeUI();
        console.log('Service Worker Registered', swReg);
      }).catch(err => {
        console.log('Service Worker Registered faile', err);
      });
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

setTimeout(() => {
  const img = new Image();
  img.src = '/static/bd.gif';
  document.body.append(img);
}, 4000);

function getInitialSubscribeStatus() {
  swRegistration.pushManager.getSubscription()
    .then(subscription => {
      console.log('initializeSubscription ', subscription);
      isSubscribed = subscription !== null;

      if (isSubscribed) {
        console.log('User IS subscribed.');
        storeSubscription({
          subscribe: true,
          subscription
        });
      } else {
        console.log('User IS NOT subscribed.');
      }
      updateBtn();
    });
}

function initializeUI() {
  pushButton.addEventListener('click', function () {
    pushButton.disabled = true;
    console.log('click isSubscribed', isSubscribed);
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });
  // 检测订阅情况
  getInitialSubscribeStatus()
}

function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function doSubscription() {
  // maybe timeout becasue of the GFW. For example, google fcm push service
  return Promise.race([swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(applicationServerPublicKey),
  }), timeoutPromise(5000)]);
}

function storeSubscription({
  subscription,
  subscribe
}) {
  fetch('/push/subscribe', {
    method: 'post',
    body: JSON.stringify({
      subscription,
      subscribe,
    })
  }).then(res => {
    console.log('成功')
  }).catch(err => {
    console.log('失败');
  });
}


function subscribeUser() {
  doSubscription().then(subscription => {
      console.log('User is subscribed.');
      storeSubscription({
        subscribe: true,
        subscription
      });
      isSubscribed = true;
      updateBtn();
    })
    .catch(err => {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });
}

function unsubscribeUser() {
  let oldSubscription;
  doSubscription()
    .then(function (subscription) {
      if (subscription) {
        oldSubscription = subscription;
        return subscription.unsubscribe();
      }
    })
    .catch(function (error) {
      console.log('Error unsubscribing', error);
    })
    .then(function (r) {
      console.log('r ', r);
      storeSubscription({
        subscribe: false,
        subscription: oldSubscription,
      });
      console.log('User is unsubscribed.');
      isSubscribed = false;

      updateBtn();
    });
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};


function timeoutPromise(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(`Timeout after ${ms} ms`);
    }, ms);
  });
}
// var vConsole = new VConsole();

let deferredPrompt;
let hasAddedToHome = false;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt2', e);
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  // e.preventDefault();
  // Stash the event so it can be triggered later.
  // deferredPrompt = e;
  if (hasAddedToHome) {
    console.log('hasAddedToHome', hasAddedToHome);
    e.prompt().then(res => console.log(res)).catch(err => console.log('err ', err));
  }

  console.log('e.prompt', e.prompt)
});

window.addEventListener('appinstalled', (event) => {
  hasAddedToHome = true;
  console.log('appinstalled', event);
});
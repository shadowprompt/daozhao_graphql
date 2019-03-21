const path = require('path');
const axios = require('axios');
const router = require('express').Router();
const {
  nodeStore,
  getWXAccessToken,
  JWTSign,
  JWTDecode,
  decryptData,
} = require('../util');

const {
  WXMIN_APPID,
  WXMIN_APPSECRET,
  WXMIN_API_URL,
} = require('../config/index');

const queryStr = require('../queryStr/user.gql');
//
router.post('*', (req, res, next) => {
  const { authorization } = req.headers;
  console.log('authorization', authorization);
  const parsedAuth = authorization && JWTDecode(authorization, false);
  console.log('parsedAuth ', parsedAuth);
  if (parsedAuth && parsedAuth.payload.openId) {
    req.body.openId = (parsedAuth && parsedAuth.payload.openId) || ''; // 将用户的openId挂载到req.body上面
  }
  next();
});

router.post('/decryptData', async (req, res) => {
  const { encryptedData, iv, openId } = req.body;
  // 获取sessionKey
  axios
    .post('http://localhost:5050/graphql', {
      query: queryStr.selectUser,
      variables: {
        openId,
      },
    })
    .then((success) => {
      console.log('get sessionKey SUCCESS', success.data);
      const [{ sessionKey }] = success.data.data.data || {};
      console.log('sessionKey', sessionKey);
      try {
        const decryptedData = decryptData(
          encryptedData,
          iv,
          sessionKey,
          WXMIN_APPID,
        );
        res.send(decryptedData);
      } catch (e) {
        console.log('try/catch', e);
        res.send({
          success: false,
        });
      }
    })
    .catch((err) => {
      console.log('query graphql err ', err);
      res.sendStatus(500);
    });
});

router.post('/login', async (req, res) => {
  const { code, encryptedData, iv } = req.body;

  const response = await axios.get(
    'https://api.weixin.qq.com/sns/jscode2session',
    {
      params: {
        appid: WXMIN_APPID,
        secret: WXMIN_APPSECRET,
        js_code: code,
        grant_type: 'authorization_code',
      },
    },
  );
  console.log('data-', response.data);
  const { openid: openId, session_key: sessionKey } = response.data;

  // decrypt 解码用户信息
  try {
    console.log('开始解码', encryptedData, iv, sessionKey, WXMIN_APPID);
    const { watermark, ...userInfo } = decryptData(
      encryptedData,
      iv,
      sessionKey,
      WXMIN_APPID,
    );
    console.log('解码后得到的userInfo', userInfo);
    await axios
      .post('http://localhost:5050/graphql', {
        query: queryStr.updateUser,
        variables: {
          ...userInfo,
          sessionKey,
        },
      })
      .then((result) => {
        console.log('存储sessionKey 成功', Date.now());
      })
      .catch((err) => console.log('存储sessionKey 失败', err));

    res.send({
      data: JWTSign({
        openId,
        expiresIn: 60 * 60 * 1,
      }),
    });
  } catch (e) {
    console.log('e', e);
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
      });
    } else {
      res.send('ok');
    }
  });
});

// 供微信服务器测试接口地址合法
router.get('/push', (req, res) => {
  const { echostr } = req.query;
  res.send(echostr);
});

router.post('/push', async (req, res) => {
  const { access_token } = await getWXAccessToken(res);
  if (!access_token) {
    return;
  }
  axios
    .post(
      `${WXMIN_API_URL}/cgi-bin/message/wxopen/template/send?access_token=${access_token}`,
      req.body,
    )
    .then((result) => {
      res.send(result.data);
      axios
        .post('http://localhost:5050/push', result.data)
        .catch((err) => console.log('推送微信反馈失败', err));
    })
    .catch((err) => res.sendStatus(502));
});

router.post('/storeFormId', async (req, res) => {
  axios
    .post('http://localhost:5050/graphql', {
      query: queryStr.updateUser,
      variables: {
        openId: req.body.openId,
        formId: req.body.formId,
      },
    })
    .then((result) => {
      res.send(result.data);
    })
    .catch((err) => {
      console.log('err', err);
      res.sendStatus(500);
    });
});

router.post('/pushAll', async (req, res) => {
  const { access_token } = await getWXAccessToken(res);
  if (!access_token) {
    return;
  }
  const { template_id } = req.body;
  const userResult = await axios.post('http://localhost:5050/graphql', {
    query: `
      query{
        users{
          openId,
          formId
        }
      }
    `,
  });
  const { users = [] } = userResult.data.data || {};
  const url = `${WXMIN_API_URL}/cgi-bin/message/wxopen/template/send?access_token=${access_token}`;
  Promise.all(
    users.map((item) =>
      axios.post(url, {
        template_id,
        form_id: item.formId,
        touser: item.openId,
        data: {
          keyword1: {
            value: '测试数据一',
            color: '#173198',
          },
          keyword2: {
            value: new Date(),
            color: '#173177',
          },
        },
      }),
    ),
  )
    .then((result) => {
      console.log('success', result);
      res.send(result.data);
    })
    .catch((err) => {
      console.log('err', err);
      res.sendStatus(500);
    });
});

// 返回小程序appId, appSecret
router.post('/getAppSecret', (req, res) => {
  res.send({
    appId: WXMIN_APPID,
    appSecret: WXMIN_APPSECRET,
  });
});

// 获取小程序access_token
router.post(
  '/getAccessToken',
  (req, res) =>
    new Promise((resolve, reject) => {
      getWXAccessToken(res)
        .then((result) => {
          resolve(result);
          res.send(result);
        })
        .catch((err) => {
          reject(err);
          res.send(err);
        });
    }),
);

// 获取小程序access_token
router.post(
  '/getAccessTokenDirect',
  (req, res) =>
    new Promise((resolve, reject) => {
      getWXAccessToken(res, true)
        .then((result) => {
          resolve(result);
          res.send(result);
        })
        .catch((err) => {
          reject(err);
          res.send(err);
        });
    }),
);

// 获取小程序模板列表
router.post('/getTemplateList', async (req, res) => {
  const { access_token } = await getWXAccessToken(res);
  if (access_token) {
    axios
      .post(
        `https://api.weixin.qq.com/cgi-bin/wxopen/template/list?access_token=${access_token}`,
        {
          access_token,
          offset: 0,
          count: 10,
        },
      )
      .then((result) => {
        console.log('result', result.data);
        res.send(result.data);
      })
      .catch((err) => {
        console.log('err', err, err.statusCode);
        res.sendStatus(502);
      });
  }
});

module.exports = router;

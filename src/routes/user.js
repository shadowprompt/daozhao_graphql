const graphqlHTTP = require('express-graphql');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { WXMIN_APPID, WXMIN_APPSECRET } = require('../config/index');
const util = require('../util/index');

const queryStr = require('../queryStr/user.gql');

const key = 'U2FsdGVkX18mJXbn8rsh05G+dF88uHDFZxLCepbFuT34XCMtYChqDHOaKkSvYdw1';

router.post('/', (req, res) => {
  const result = jwt.sign(
    {
      foo: 'bar',
      am: 'dad',
      // exp: Math.floor(Date.now() / 1000) + (60 * 60), // 签发一条 1 小时后失效的 JWT
    },
    key,
    {
      expiresIn: 100,
    },
  );
  res.send(result);
});

module.exports = router;

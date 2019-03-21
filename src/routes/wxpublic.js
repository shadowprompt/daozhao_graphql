const router = require('express').Router();

// 供微信服务器测试接口地址合法
router.get('/', (req, res) => {
  const { echostr } = req.query;
  res.send(echostr);
});
module.exports = router;

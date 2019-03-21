const router = require('express').Router();
const path = require('path');
router.get('/', function(req, res) {
  const { utm_source } = req.query;
  console.log('utm_source ', utm_source);
  res.sendFile(path.resolve(__dirname, '../index.html'));
});

module.exports = router;

const router = require('express').Router();
const path = require('path');
router.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../service-worker.js'));
});

module.exports = router;
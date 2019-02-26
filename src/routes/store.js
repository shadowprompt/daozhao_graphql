const router = require('express').Router();

const {
  nodeStore
} = require('../util/index');

router.post('/', (req, res) => {
  const {
    dir,
    key
  } = req.body;
  if (!dir) {
    res.status(502).send({
      errMsg: 'dir is required!'
    });
    return;
  }
  const localStorage = nodeStore(`../localStorage/${dir}`);
  const result = key ? [{
    [key]: localStorage.getItem(key)
  }] : localStorage._keys.map(key => ({
    [key]: localStorage.getItem(key)
  }));
  res.send({
    data: result,
  });
});

module.exports = router;
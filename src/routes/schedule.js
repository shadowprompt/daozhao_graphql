const schedule = require('node-schedule');
const router = require('express').Router();

const { getWXAccessToken } = require('../util/index');

let job;

function setSchedule(minutes) {
  const nextTime = Date.now() + minutes * 60 * 1000;
  if (job) {
    job.cancel();
  }

  job = schedule.scheduleJob(nextTime, () => {
    console.log('执行定时任务');
    getWXAccessToken(void 0, true).catch((err) =>
      console.log('定时请求access_token失败', err),
    );
    setSchedule(minutes);
  });
}
router.post('/', (req, res) => {
  getWXAccessToken(res, true)
    .then(() => {
      setSchedule(100);
      res.send({
        success: true,
      });
    })
    .catch((err) => {
      console.log('定时请求access_token失败', err);
    });
});

router.post('/list', (req, res) => {
  if (job) {
    res.send(job.nextInvocation());
  } else {
    res.send();
  }
});

module.exports = router;

const router = require('express').Router();
router.get('/', (req, res) => {
  res.send({
    name: 'Daozhao Lab',
    short_name: 'DaozhaoLab',
    start_url: '/?utm_source=pwa_homescreen',
    display: 'standalone',
    background_color: '#ffffff',
    description: '道招网新技术研发、测试实验室！',
    orientation: 'portrait',
    theme_color: '#5eace0',
    icons: [
      {
        src: '/static/res/mipmap-mdpi/ic_launcher.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/static/res/mipmap-hdpi/ic_launcher.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/static/res/mipmap-xhdpi/ic_launcher.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/static/res/mipmap-xxhdpi/ic_launcher.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/static/res/mipmap-xxxhdpi/ic_launcher.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/static/web_hi_res_512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  });
});

module.exports = router;

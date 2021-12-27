// 无需引入，项目自动注册
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://www.test.com/',
      changeOrigin: true,
    })
  );
};
// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "홈페이지 URL",
      pathRewrite: {
        "^/api": "",
      },
      changeOrigin: true,
    })
  );
};

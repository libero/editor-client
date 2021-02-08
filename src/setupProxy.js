// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

const ARTICLE_RE = /^\/api\/v1\/articles\/([0-9]+)$/;
const ARTICLE_CHANGES_RE = /^\/api\/v1\/articles\/([0-9]+)\/changes/;
const ARTICLE_ASSETS_RE = /^\/api\/v1\/articles\/([0-9]+)\/assets\/([^\/]+)$/;

function createStaticProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000/',
      changeOrigin: false,
      pathRewrite: function (path, req) {
        if (path.match(ARTICLE_RE)) {
          const articleId = path.match(ARTICLE_RE)[1];
          return `/manuscripts/${articleId}/manuscript.xml`;
        }

        if (path.match(ARTICLE_CHANGES_RE)) {
          const articleId = path.match(ARTICLE_CHANGES_RE)[1];
          return `/changes/${articleId}/changes.json`;
        }

        if (path.match(ARTICLE_ASSETS_RE)) {
          const [, articleId, assetName] = path.match(ARTICLE_ASSETS_RE);
          return `/manuscripts/${articleId}/${assetName}`;
        }

        return path;
      }
    })
  );
}

function createLocalstackProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080/',
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/articles': '/articles'
      }
    })
  );
}

module.exports = process.argv[2] === '--localstack' ? createLocalstackProxy : createStaticProxy;

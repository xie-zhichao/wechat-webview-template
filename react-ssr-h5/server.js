// require('next-inferno/alias')()
const fastify = require('fastify')({ logger: { level: 'error' } })
const Next = require('next')
const port = parseInt(process.env.PORT, 10) || 3011
const dev = process.env.NODE_ENV !== 'production'
const proxyMiddleware = require('http-proxy-middleware')
const getPageFile = require('./utils/getPageFile')
const devProxy = {
  '/api': {
    target:'http://nongqibang.com:7041',
    // target: "http://192.167.5.212:7041",
    // target: "http://192.167.5.113:3000",
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
  '/getToken':{
    target: "http://127.0.0.1:3001",
    // target: "http://192.167.5.113:3000",
    // pathRewrite: { '^/getToken': '' },
    changeOrigin: true,
  }
}

fastify.register((fastify, opts, next) => {
  const app = Next({dev, dir: '.'})
  app
    .prepare()
    .then(() => {
      if (dev) {
        fastify.get('/_next/*', (req, reply) => {
          return app.handleRequest(req.req, reply.res).then(() => {
            reply.sent = true
          })
        })
        if (devProxy) {
          Object.keys(devProxy).forEach(function (context) {
            fastify.use(proxyMiddleware(context, devProxy[context]))
          })
        }
      }

      getPageFile.forEach((e) => {
        fastify.get('/' + e, (req, reply) => {
          return app.render(req.req, reply.res, '/' + e, req.query).then((e) => {
            reply.sent = true
          })
        })
      })

      fastify.get('/*', (req, reply) => {
        return app.handleRequest(req.req, reply.res).then(() => {
          reply.sent = true
        })
      })

      fastify.setNotFoundHandler((request, reply) => {
        return app.render404(request.req, reply.res).then(() => {
          reply.sent = true
        })
      })
      next()
    })
    .catch(err => next(err))
})

fastify.listen(port, '0.0.0.0',err => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})


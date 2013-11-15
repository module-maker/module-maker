var Router = require("routes-router")
var ServeBrowserify = require("serve-browserify")
var path = require("path")
var st = require("st")

var AuthRoute = require("./routes/auth.js")
var PublishRoute = require("./routes/publish.js")

module.exports = createRouter

function createRouter(config) {
    var router = Router()

    router.addRoute("/", function (req, res) {
        req.url = "/static/index.html"
        mount(req, res)
    })

    router.addRoute("/auth", AuthRoute(config))

    var mount = st({
        path: path.join(__dirname, "static"),
        cache: config.cacheAssets,
        url: "/static"
    })

    router.addRoute("/static/*", mount)

    if (!config.cacheAssets) {
        router.addRoute("/entry.js", function (req, res) {
            ServeBrowserify({
                root: path.join(__dirname, "browser"),
                gzip: true,
                cache: config.cacheAssets
            })(req, res)
        })
    } else {
        router.addRoute("/entry.js", function (req, res) {
            req.url = "/static/index.js"
            mount(req, res)
        })
    }

    router.addRoute("/publish", PublishRoute(config))

    return router
}

// Test for socket.dev 

var http = require("http")
var fs = require("fs")
var path = require("path")
var process = require("process")
var ConfigChain = require("config-chain")
var console = require("console")

var Router = require("./router.js")
var corsHeaders = require("./lib/cors-headers.js")

var NODE_ENV = process.env.NODE_ENV

var config = ConfigChain(
    path.join(__dirname, "config", "config." + NODE_ENV + ".json"),
    path.join(__dirname, "config", "config.json")
).store
var port = config.port

var router = Router(config)
var server = http.createServer(function (req, res) {
    corsHeaders(req, res)
    router(req, res)
})

server.listen(port, function (err) {
    if (err) {
        console.error(err)
        process.exit(-1)
    }

    if (process.getuid && process.getuid() === 0) {
        fs.stat(__filename, function (err, stat) {
            if (err) {
                return console.error(err)
            }
            process.setuid(stat.uid)
        })
    }

    console.log("Server running at http://localhost:" +
        port + "/ in ", NODE_ENV)
})

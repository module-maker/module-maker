var https = require("https")
var qs = require("querystring")

module.exports = auth

function auth(config) {
    return authenticate

    function authenticate(code, cb) {
        var data = qs.stringify({
            client_id: config.oauth_client_id,
            client_secret: config.oauth_client_secret,
            code: code
        })

        var reqOptions = {
            host: config.oauth_host,
            port: config.oauth_port,
            path: config.oauth_path,
            method: config.oauth_method,
            headers: { "content-length": data.length }
        }

        var body = ""
        var req = https.request(reqOptions, function(res) {
            res.setEncoding("utf8")
            res.on("data", function (chunk) { body += chunk })
            res.on("end", function() {
                cb(null, qs.parse(body).access_token)
            })
        })

        req.write(data)
        req.end()
        req.on("error", function(e) { cb(e.message) })
    }
}

var url = require("url")
var qs = require("querystring")
var template = require("string-template")
var sendError = require("send-data/error")
var sendHtml = require("send-data/html")

var Auth = require("../lib/github-auth.js")

var script = "<!doctype html>"
script += "<meta-charset='utf-8'>"
script += "<title>User Auth</title>"
script += "<script type='text/javascript'>"
script += "var data = {data};"
script += "window.opener.postMessage(data, window.location);"
script += "window.close();"
script += "</script>"

module.exports = Github

function Github(config) {
    var auth = Auth(config.github)

    return function github(req, res, opts) {
        var code = qs.parse(url.parse(req.url).query).code

        if (!code) {
            return sendError(req, res, { "error": "bad_code" })
        }

        auth(code, function (err, token) {
            if (err || !token) {
                return sendError(req, res, {"error": "bad_code"})
            }

            var userData = {
                token: token
            }

            sendHtml(req, res, template(script, {
                data: JSON.stringify(userData)
            }))
        })
    }
}

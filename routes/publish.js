var sendError = require("send-data/error")
var sendJson = require("send-data/json")
var jsonBody = require("body/json")

var publish = require("../publish-npm")

module.exports = Publish

/*
    POST /publish {
        userName: "raynos",
        github: "Raynos/after"
    }
*/
function Publish(config) {
    return publishRoute

    function publishRoute(req, res) {
        if (req.method !== "POST") {
            res.statusCode = 405
            return res.end("Method not allowed")
        }

        jsonBody(req, res, function (err, body) {
            if (err) {
                return sendError(req, res, err)
            }

            body = body || {}

            var github = body.github
            var userName = body.userName

            if (typeof github !== "string" || typeof userName !== "string") {
                return sendError(req, res, new Error("invalid body"))
            }

            body.userName = body.userName.toLowerCase()
            body.userName = body.userName.trim()
            body.github = body.github.trim()

            publish(body.github, body.userName, config.npm,
                function (err, resp) {
                    if (err) {
                        console.log("error", err, err.message)
                        return sendError(req, res, err)
                    }

                    sendJson(req, res, {
                        code: 200,
                        message: "ok"
                    })
                })
        })
    }
}

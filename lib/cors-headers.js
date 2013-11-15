var url = require("url")

module.exports = corsHeaders

function corsHeaders(req, res) {
    var host
    if (req.headers.referer) {
        var parsed_url = url.parse(req.headers.referer)
        host = parsed_url.protocol + "//" + parsed_url.host
    } else {
        host = "*"
    }

    res.setHeader("Access-Control-Allow-Origin", host)
    res.setHeader("Access-Control-Allow-Credentials", true)
    res.setHeader("Access-Control-Allow-Methods",
        "POST, GET, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
}
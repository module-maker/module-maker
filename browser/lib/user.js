var xhr = require("xhr")

module.exports = user

function user(token, cb) {
    xhr({
        uri: "https://api.github.com/user?access_token=" + token,
        json: true
    }, function(err, resp, body) {
        if (err) {
            return cb(err)
        }

        cb(null, body)
    })
}
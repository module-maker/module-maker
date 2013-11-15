var request = require("request")

module.exports = user

function user(token, cb) {
    request({
        uri: "https://api.github.com/user",
        json: {
            token: token
        }
    }, function(err, resp, body) {
        if (err) {
            return cb(err)
        }

        cb(null, body)
    })
}



var request = require("request")

module.exports = checkNamespace

function checkNamespace(moduleName, callback) {
    request("https://registry.npmjs.org/" + moduleName, function (err, res) {
        // console.log("wtf", res, res.statusCode)
        if (err) {
            return callback(null, false)
        } else if (res && res.statusCode === 200) {
            return callback(null, true)
        } else {
            return callback(null, false)
        }
    })
}

var document = require("global/document")
var window = require("global/window")

var gh = "https://github.com/login/oauth/authorize?scope=public_repo,repo&client_id="

module.exports = getAuth

function getAuth(clientId) {
    var protocol = window.location.protocol
    var host = window.location.hostname
    window.open(gh + clientId)
}
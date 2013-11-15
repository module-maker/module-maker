var publish = require("./index.js")

var repo = "Raynos/demo-test"
var userName = "raynos"

console.log("publishing", repo, userName)

publish(repo, userName, function (err, result) {
    if (err) {
        console.error("err", err)
    }

    console.log("result", result)
})

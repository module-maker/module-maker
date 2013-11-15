var publish = require("./index.js")

var repo = String(process.argv[2])
var userName = String(process.argv[3])
// var repo = "Raynos/demo-test"
// var userName = "raynos"

console.log("publishing", repo, userName)

publish(repo, userName, function (err, result) {
    console.log("fini")
    if (err) {
        console.error("err", err)
    }

    console.log("result", result)
    process.exit()
})

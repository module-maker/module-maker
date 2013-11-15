var xhr = require("xhr")

var createFiles = require("./create-files")

module.exports = publishModule

/*  publishModule := ({
        name: String,
        metaData: Object,
        deps: Array,
        sourceCode: String
    })

*/
function publishModule(module, callback) {
    getGithubUser(function (err, user) {
        if (err) {
            return callback(err)
        }

        module.metaData.githubUserName = user.login
        module.metaData.githubEmail = user.email
        module.metaData.githubFragment = user.login + "/" + module.name

        createFiles(module, function (err, files) {
            if (err) {
                return callback(err)
            }

            // console.log("files", files)

            if (module.metaData.demoSource) {
                var example = {}
                example["index.js"] = module.metaData.demoSource || ""

                files["example"] = example
            }
            

            if (module.metaData.testSource) {
                var test = {}
                test["index.js"] = module.metaData.testSource || ""

                files["test"] = test
            }
            
            if (module.metaData.docsSource) {
                files["README.md"] = module.metaData.docsSource || ""
            }

            if (module.sourceCode) {
                files["index.js"] = module.sourceCode
            }

            module.metaData.gitRepoFiles = files

            githubPublish(module, function (err) {
                if (err) {
                    return callback(err)
                }

                console.log("module", module)
                npmPublish(module, callback)
                // callback(null, { code: 200, message: "ok" })
            })
        })
    })
}

function npmPublish(module, callback) {
    xhr({
        uri: "/publish",
        method: "POST",
        timeout: 20 * 1000,
        json: {
            userName: module.metaData.npmUserName,
            github: module.metaData.githubFragment
        }
    }, function (err, res) {
        console.log("err", err, res)
        if (err) {
            return callback(err)
        }

        if (res.body && res.body.errors && res.body.errors[0]) {
            return callback(res.body.errors[0])
        }

        callback(null, res.body)
    })
}

// @creationix implement thing here
var githubPublish = require('../js-github/publish.js');

// implement real thing
function getGithubUser(callback) {
    //callback(null, { name: "Raynos", email: "raynos2@gmail.com" })
    callback(null, JSON.parse(localStorage.getItem("user")))
}

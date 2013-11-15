var mkdirp = require("mkdirp")

var gitrun = require("./lib/git-run.js")

module.exports = cloneLocally

function cloneLocally(githubUri, folder, callback) {
    mkdirp(folder, function (err) {
        if (err) {
            return callback(err)
        }

        // git@github.com:Raynos/team-mad-science.git
        gitrun(["clone", "git@github.com:" + githubUri], {
            cwd: folder
        }, callback)
    })
}

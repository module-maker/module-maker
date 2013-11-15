var path = require("path")

var npmrun = require("./lib/npm-run.js")

var npmConfig = path.join(__dirname, "..", ".npmrc")

module.exports = npmPublish

function npmPublish(folder, userName, opts, callback) {
    ensureUser(opts, function (err, result) {
        if (err) {
            return callback(err)
        }

        callPublish(folder, function (err, result) {
            if (err) {
                return callback(err)
            }

            changeOwner(folder, userName, opts, callback)
        })
    })
}

// ensure the user is added
function ensureUser(opts, callback) {
    var cmd = npmrun([
        "--userconfig=" + npmConfig,
        "adduser"
    ], callback)

    matchRegex(cmd, /Username:/, function () {
        // console.log("wrote Username", config.username)
        cmd.stdin.write(opts.username + "\n")
    })
    matchRegex(cmd, /Password:/, function () {
        // console.log("wrote password", config.password)
        cmd.stdin.write(opts.password + "\n")
    })
    matchRegex(cmd, /Email:/, function () {
        // console.log("wrote email", config.email)
        cmd.stdin.write(opts.email + "\n", function () {
            cmd.stdin.end()
        })
    })
}

function callPublish(folder, callback) {
    npmrun([
        "--userconfig=" + npmConfig,
        "publish"
    ], {
        cwd: folder
    }, callback)
}

function changeOwner(folder, userName, opts, callback) {
    var packageName = path.basename(folder)

    npmrun([
        "--userconfig=" + npmConfig,
        "owner",
        "add",
        userName,
        packageName
    ], { cwd: folder }, function (err) {
        if (err) {
            return callback(err)
        }

        npmrun([
            "--userconfig=" + npmConfig,
            "owner",
            "rm",
            opts.username,
            packageName
        ], { cwd: folder }, callback)
    })
}

function matchRegex(command, regex, callback) {
    var stdout = ""

    command.stdout.on("data", ondata)

    function ondata(chunk) {
        stdout += String(chunk)
        if (regex.test(stdout)) {
            command.stdout.removeListener("data", ondata)
            callback()
        }
    }
}

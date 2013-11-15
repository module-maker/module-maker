var console = require("console")
var spawn = require("child_process").spawn

module.exports = Runner

function Runner(command, options) {
    var log = options.log || console.log
    var error = options.error || console.error

    return run

    function run(cmds, opts, cb) {
        if (typeof opts === "function") {
            cb = opts
            opts = {}
        }

        var proc = spawn(command, cmds, opts)
        var stdout = ""
        var stderr = ""

        proc.stdout.on("data", function (d) {
            log(String(d))
            stdout += String(d)
        })

        proc.stderr.on("data", function (d) {
            // The following logs on stderr which is not indicating 
            // an error, so just log it
            // To git@github.com:thlorenz/test-gitify.git
            //     d9ad070..4f8ebfd  master -> master
            error(String(d))
            stderr += String(d)
        })

        proc.on("close", function (code) {
            if (code !== 0) {
                return cb(new Error(command + " " + cmds.join(" ") +
                    " returned with code " + code))
            }
            cb(null, { stdout: stdout, stderr: stderr })
        })

        return proc
    }
}

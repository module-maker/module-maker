var console = require("console")

var Runner = require("./run.js")

module.exports = Runner("git", {
    log: function () {
        var args = [].slice.call(arguments)
        args.unshift("git")
        console.log.apply(console, args)
    },
    error: function () {
        var args = [].slice.call(arguments)
        args.unshift("git")
        console.error.apply(console, args)
    }
})

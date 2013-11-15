var console = require("console")

var Runner = require("./run.js")

module.exports = Runner("npm", {
    log: function () {
        var args = [].slice.call(arguments)
        args.unshift("npm")
        console.log.apply(console, args)
    },
    error: function () {
        var args = [].slice.call(arguments)
        args.unshift("npm")
        console.error.apply(console, args)
    }
})

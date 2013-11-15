var after = require("after")

var locals = {
    project: function (opts, cb) {
        cb(null, opts.name)
    },
    description: function (opts, cb) {
        cb(null, opts.metaData.description || "")
    },
    projectName: function (opts, cb) {
        cb(null, camelCase(opts.name))
    },
    year: function (opts, cb) {
        cb(null, new Date().getFullYear())
    },
    name: function (opts, cb) {
        cb(null, opts.metaData.githubUserName || "")
    },
    email: function (opts, cb) {
        cb(null, opts.metaData.githubEmail || "")
    }
}

module.exports = Locals

function Locals(opts, cb) {
    pump(locals, opts, cb)
}

function pump(locals, opts, callback) {
    var keys = Object.keys(locals)
    var result = {}
    var next = after(keys.length, function (err) {
        if (err) {
            return callback(err)
        }

        callback(null, result)
    })

    keys.forEach(function (key) {
        locals[key](opts, function (err, value) {
            if (err) {
                return next(err)
            }

            result[key] = value
            next()
        })
    })
}

function camelCase(str) {
    return str.replace(/[_.-](\w|$)/g, function (_,x) {
        return x.toUpperCase()
    })
}

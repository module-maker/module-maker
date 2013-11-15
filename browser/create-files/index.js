var extend = require("xtend")

var defaultTemplate = require("./template.js")
var Locals = require("./locals.js")

var isVariableRegex = /\{\{([^}]+)\}\}/g

normalizeTemplate(defaultTemplate)

// console.log("wut", defaultTemplate)

module.exports = createFiles

function createFiles(module, callback) {
    Locals(module, function (err, locals) {
        if (err) {
            return callback(err)
        }

        callback(null, renderTemplate(defaultTemplate, locals))
    })
}

function renderTemplate(template, locals) {
    template = extend(template)

    Object.keys(template).forEach(function (key) {
        var value = template[key]

        if (typeof value === "string") {
            template[key] = value.replace(isVariableRegex,
                function (_, key) {
                    return locals[key]
                })
        } else if (typeof value === "object") {
            template[key] = renderTemplate(value, locals)
        }
    })

    return template
}

function normalizeTemplate(template) {
    Object.keys(template).forEach(function (key) {
        var value = template[key]

        if (Array.isArray(value)) {
            template[key] = value.join("\n")
        } else if (typeof value === "object") {
            template[key] = normalizeTemplate(value)
        }
    })

    return template
}

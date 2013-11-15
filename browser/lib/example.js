var template = require("string-template")

var sourceTemplate = "(function () {\n" +
"    var module = {};\n" +
"    var exports = {};\n" +
"    (function (module, exports) {\n" +
"{0}\n" +
"    })(module, exports);\n" +
"    return Object.keys(exports).length > 0 ? exports : module.exports;\n" +
"})()"

module.exports = example

function example(sandbox, opts) {
    var moduleCode = opts.moduleCode
    var moduleName = opts.moduleName
    var injectSource =  new RegExp("require(\\s)*\\((\\s)*((\"" +
        "((" + moduleName +")|(\\.\\./index.js))" +
        "\")|('" +
        "((" + moduleName +")|(\\.\\./index.js))" +
        "'))(\\s)*\\)")

    var injectedModule = template(sourceTemplate, moduleCode)
    var sourceCode = opts.sourceCode.replace(injectSource, injectedModule)

    sandbox.bundle(sourceCode)
}




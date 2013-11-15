var window = require("global/window")

// from Paul Irish at some point...
module.exports = (function(callback) {
  return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(function() {
          var timestamp = Date.now();
          callback(timestamp);
        }, 1000 / 60);
      };
})();

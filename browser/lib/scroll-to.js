var requestAnimationFrame = require("./request-animation-frame.js")

module.exports = scrollTo

//https://gist.github.com/dezinezync/5487119
function scrollTo(Y, element, duration, easingFunction, callback) {
  var start = Date.now();
  var   from = element.scrollTop;

  if (from === Y && typeof(callback) !== "undefined") {
      callback();
      return; /* Prevent scrolling to the Y point if already there */
  }

  function min(a,b) {
    return a<b?a:b;
  }

  function scroll(timestamp) {

      var currentTime = Date.now();
      var time = min(1, ((currentTime - start) / duration));
      var easedT = easingFunction(time);

      var documentScrollTop = (easedT * (Y - from)) + from;
      element.scrollTop = documentScrollTop;

      if (time < 1) {
        requestAnimationFrame(scroll);
      }
      else {
        if (callback) {
          callback();
        }
      }

  }

  requestAnimationFrame(scroll);
}

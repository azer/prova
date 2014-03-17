var select = require("select-dom");
var layout = require("./layout");

module.exports = start;

function start () {
  window.addEventListener("message", receiveMessage, false);
  layout.run();
}

function receiveMessage (message) {
  if (message.data.type == 'error') {
    fail(message.data);
  }

  if (message.data.type == 'test') {
    layout.markTest(message.data);
  }

  if (message.data.type == 'end') {
    end(message.data);
  }
}

function fail (error) {
  layout.addError(error);
}

function end (result) {
  if (!result.failed) layout.pass(result.passed);
  layout.list(result.tests);
}

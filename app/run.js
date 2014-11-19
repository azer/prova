var select = require("dom-select");
var layout = require("./layout");
var socket = require("./socket");

module.exports = start;

function start (url) {
  window.addEventListener("message", receiveMessage, false);

  // clear the console on each run so that previous messages don't show
  if (window.console && console.clear) {
    console.clear();
  }

  layout.run(url);
}

function receiveMessage (message) {
  if (message.data.type == 'error') {
    fail(message.data);
  }

  if (message.data.type == 'test') {
    test(message.data);
  }

  if (message.data.type == 'end') {
    end(message.data);
  }
}

function test (msg) {
  layout.markTest(msg);
  socket.send({
    test: msg.name,
    userAgent: navigator.userAgent
  });
}

function fail (error) {
  socket.send({ fail: error, userAgent: navigator.userAgent });
  layout.addError(error);
}

function end (result) {
  socket.send({ userAgent: navigator.userAgent, result: result });

  if (!result.failed) layout.pass(result.passed);
  layout.list(result.tests);
}

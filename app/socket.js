var pubsub = require("pubsub")();
var status = false;

connect();

module.exports = pubsub;
module.exports.isOpen = isOpen;

function connect () {
  var ws = new WebSocket(document.location.origin.replace('http', 'ws'));
  ws.onopen = open;
  ws.onmessage = message;
  ws.onclose = close;
}

function isOpen () {
  return status;
}

function open () {
  status = true;
  pubsub.publish({ open: true });
}

function message (event) {
  pubsub.publish({
    message: JSON.parse(event.data)
  });
}

function close () {
  if (status == false) return;
  status = false;
  pubsub.publish({ close: true });
  reconnect();
}

function reconnect () {
  if (status) return;
  connect();
  setTimeout(reconnect, 1000);
}

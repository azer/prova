var layout = require("./layout");
var run = require("./run");
var socket = require("./socket");

run();

socket(function (update) {
  if (!update || !update.message) return;
  if (update.message.restart) run();
});

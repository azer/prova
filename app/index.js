var layout = require("./layout");
var run = require("./run");
var socket = require("./socket");
var console = require("./console");

console.override();

socket(function (update) {
  if (!update || !update.message) return;
  if (update.message.start) {
    run(update.message.url);
  }

  if (update.message.restart) run();
});

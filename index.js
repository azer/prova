var tape = require('tape');
var isNode = require("is-node");
var view = require('./lib/view');
var refine = require("./lib/refine");
var command = require('./lib/command');
var isProvaFrame = !isNode && document && document.getElementById && document.getElementById('prova-frame');
var nodeRequire;

if (command.browser) {
  nodeRequire = require;
  nodeRequire('./lib/browser')(command);
  delete nodeRequire;
} else if (isNode || isProvaFrame) {
  tape.createStream({ objectMode: true }).pipe(refine).pipe(view);
}

module.exports = prova;

function prova (title, fn) {
  if (command.browser) return;
  if (command.grep && title.indexOf(command.grep) == -1) return;
  return tape(title, fn);
}

var tape = require('tape');
var isNode = require("is-node");
var view = require('./lib/view');
var refine = require("./lib/refine");
var command = require('./lib/command');
var isProvaFrame = !isNode && document && document.getElementById && document.getElementById('prova-frame');
var nodeRequire;


empty.skip = empty;
empty.only = empty;

if (command.launch === true) {
  nodeRequire = require;
  nodeRequire('./lib/cli').launch();
  module.exports = empty;
  return;
}

if (command.browser) {
  nodeRequire = require;
  nodeRequire('./lib/cli').launch();
  nodeRequire('./lib/browser')([require.main.filename], command);
  delete nodeRequire;
} else if (isNode || isProvaFrame) {
  tape.createStream({ objectMode: true }).pipe(refine).pipe(view);
}

module.exports = prova;
module.exports.skip = skip;
module.exports.only = only;

function prova (title, fn) {
  if (command.browser) return;
  if (command.grep && title.indexOf(command.grep) == -1) return skip(title, fn);
  return tape(title, fn);
}

function skip (title, fn) {
  return tape.skip(title, fn);
}

function only (title, fn) {
  return tape.only(title, fn);
}

function empty () {}

var tests = require("./tests");
var style = require("style-format");
var format = require("format-text");
var template = style('    {bold}{percent}%:{reset} {test}\n');
var log;

module.exports = {
  init: init,
  show: show,
  end: end
};

function init () {
  log = require('single-line-log').stdout;
  console.log('');
}

function show (row) {
  if (!log) init();

  var remaining = tests.remaining();
  var done = tests.count() - remaining.length;
  var percent = !done ? 1 : (done * 100) / tests.count();
  var current = remaining[0];

  log(format(template, {
    percent: percent,
    test: current || 'Done!'
  }));
}

function end (msg) {
  log((msg || '').replace(/^\n/, '') + '\n');
}

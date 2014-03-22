var through = require("through");
var format = require("format-text");
var filterStack = require("filter-stack");
var prettifyError = require("prettify-error");
var template = require("./node-template");

var failTemplate = template('fail');
var resultPassTemplate = template('result-pass');
var resultTemplate = template('result');

var failed = 0;
var passed = 0;
var excludeFromStack = ['prova'];

module.exports = reporter;

function reporter () {
  var ts = through(each, end);
  return ts;
}

function each (row) {
  if (row.type == 'assert' && row.ok) {
    passed++;
  } else if (row.type == 'assert') {
    failed++;
    fail(row);
  }

}

function fail (row) {
  row.error.stack = filterStack(row.error, excludeFromStack).stack;
  var prettifiedError = prettifyError(row.error, 2);

  if (!prettifiedError) {
    prettifiedError = '\n' + row.error.message + '\n' + row.error.stack;
  }

  console.error(format(failTemplate, {
    title: row.testName,
    error: tab(prettifiedError, '    ')
  }));
}

function end () {
  console.log(format(failed ? resultTemplate : resultPassTemplate, passed, failed));
  this.queue(null);
}

function tab (text, ch) {
  return ch + text.replace(/\n/g, '\n' + ch);
}

var through = require("through");
var filterStack = require("filter-stack");
var failingCode = require("failing-code");
var tests = {};

var started = false;
var failed = 0;
var passed = 0;
var excludeFromStack = ['prova'];

module.exports = reporter;

function reporter () {
  var ts = through(each, end);
  return ts;
}

function each (row) {
  var msg;

  if (!started) {
    post('start');
    started = true;
  }

  if (row.type == 'assert' && row.ok) {
    passed++;
  } else if (row.type == 'assert') {
    tests[row.testName] = false;
    failed++;
    fail(row);
  }

  if (row.type == 'test') {
    tests[row.name] = true;
    post('test', row);
  }

  this.queue(row);
}

function fail (row) {
  var failing = failingCode(row.error, __source_code, 2);

  post('error', {
    test: row.testName,
    name: row.name,
    stack: row.error.stack,
    source: failing,
    expected: row.expected,
    actual: row.actual
  });
}


function end () {
  post('end', {
    failed: failed,
    passed: passed,
    tests: tests
  });
  this.queue(null);
}

function post (type, msg) {
  msg || (msg = {});
  msg.type = type;
  window.parent.postMessage(msg, document.location.origin);
}

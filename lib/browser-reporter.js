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
  return through(each, end);
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
  var error = row.actual && row.actual.stack ? row.actual : row.error;
  var shift = error == row.actual ? 0 : 2;
  var failing = failingCode(error, __source_code, shift);

  var expected = row.expected || '';
  var actual = row.actual || '';

  if (error == row.actual) {
    expected = undefined;
    actual = undefined;
  }

  post('error', {
    test: row.testName,
    name: row.name,
    stack: error.stack || '',
    source: failing || [],
    expected: expected,
    actual: actual
  });
}

function end () {
  post('end', {
    failed: failed,
    passed: passed,
    tests: tests
  });

  this.queue && this.queue(null);
}

function post (type, msg) {
  msg || (msg = {});
  msg.type = type;
  window.parent.postMessage(JSON.parse(JSON.stringify(msg)), document.location.origin);
}

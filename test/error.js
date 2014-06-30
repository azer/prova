var test = require("../");

test('throws an error', function (t) {
  err++;
});

test('same as the other one', function (t) {
  err++;
});

test('foo bar', function (t) {
  fail++
});

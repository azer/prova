var test = require('../');

test('multiple tests', function (assert) {
  assert.ok(true);
  assert.end();
});

test('another case', function (assert) {
  assert.ok(true);
  assert.notOk(false);
  assert.end();
});

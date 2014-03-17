var test = require('./');

test('just passing', function (assert) {
  assert.plan(1);
  assert.equal(true, true);
});

test('a test with failing assertions', function (assert) {
  assert.plan(3);
  assert.equal(true, false);
  assert.equal(2, 3);
  assert.equal({ a: 1 }, { a: 1 });
});

test('another test failing', function (assert) {
  assert.plan(2);
  assert.ok(false);
  assert.notOk(true);
});

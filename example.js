var test = require('./');

test('just passing', function (assert) {
  assert.plan(1);
  assert.equal(true, true);
});

test('a test with failing assertions', function (assert) {
  assert.plan(2);
  assert.equal('<h1>hello</h1>', '<h2>hello</h2>');
  assert.equal({ a: 1, b: 3 }, { a: 1 });
});

test('a test fails because of invalid planning', function (assert) {
  assert.plan(3);
  assert.ok(false);
});

var test = require("../");

test('such slow', function (t) {
  t.plan(1);

  setTimeout(function () {
    t.ok(1);
  }, 1000);
});

test('so mystery', function (t) {
  t.plan(1);

  setTimeout(function () {
    t.ok(1);
  }, 1000);
});

test('how steady', function (t) {
  t.plan(1);

  setTimeout(function () {
    t.ok(1);
  }, 1000);
});

test('very unsure', function (t) {
  t.plan(1);

  setTimeout(function () {
    t.ok(1);
  }, 1000);
});

test('wow', function (t) {
  t.plan(1);

  setTimeout(function () {
    t.ok(1);
  }, 1500);
});

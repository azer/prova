var tests = [];
var state = {};

module.exports = {
  add: add,
  get: get,
  count: count,
  done: done,
  remaining: remaining
};

function get () {
  return tests;
}

function add (name) {
  tests.push(name);
}

function count () {
  return tests.length;
}

function done (name) {
  state[name] = true;
}

function remaining () {
  return tests.filter(function (name) {
    return !state[name];
  });
}

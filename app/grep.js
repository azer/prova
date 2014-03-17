var options = require("./options");

module.exports = grep;

function grep (value) {
  if (arguments.length > 0) {
    set(value);
  }

  return get();
}

function set (value) {
  var all = options.read();
  all.grep = value;
  options.write(all);
}

function get () {
  return options.read()['grep'];
}

var querystring = require("querystring");

module.exports = {
  read: read,
  write: write,
  stringify: stringify
};

function stringify () {
  return document.location.hash.slice(1);
}

function read () {
  var hash = stringify();
  if (!hash) return {};
  return querystring.parse(hash, ';', ':');
}

function write (values) {
  var str = querystring.stringify(values, ';', ':');
  var url = document.location.href.split('#')[0];
  document.location.href = url + '#' + str;
}

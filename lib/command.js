var isNode = require("is-node");
var nodeRequire;
var command;

if (isNode) {
  nodeRequire = require;
  command = nodeRequire('./node-command');
  delete nodeRequire;
} else {
  command = require('./browser-command');
}

module.exports = command;

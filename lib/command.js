var isNode = require("is-node");
var nodeRequire;
var command;
var cli;

if (isNode) {
  nodeRequire = require;
  cli = nodeRequire('./cli');
  cli.defaults();
  command = cli.command;
  delete nodeRequire;
} else {
  command = require('./browser-command');
}

module.exports = command;

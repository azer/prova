var isNode = require("is-node");
var reporter;
var nodeRequire;

if (isNode) {
  nodeRequire = require;
  reporter = nodeRequire('./node-reporter');
  nodeRequire = null;
} else {
  reporter = require('./browser-reporter');
}

module.exports = reporter();

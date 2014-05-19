var command = require("new-command")({
  l: 'launch',
  g: 'grep',
  b: 'browser',
  e: 'headless',
  r: 'proxy',
  o: 'port',
  d: 'host',
  q: 'quit',
  t: 'transform',
  u: 'plugin',
  x: 'examples'
});

module.exports = command;

require('default-debug')('prova:browser,prova:launch,prova:exec-first');

var command = require('./node-command');
var path = require('path');
var glob = require('flat-glob');
var fs = require('fs');
var launch = require("../lib/launch");
var exists = fs.existsSync;
var stats = fs.lstatSync;

module.exports = {
  command: command,
  defaults: defaults,
  run: run,
  launch: launchBrowser,
  examples: examples
};

function defaults () {
  if (!command.host) command.host = 'localhost';
  if (!command.port) command.port = 7559;
}

function run () {
  defaults();

  if (command.launch === true) return launch.list();
  if (command.examples) return examples();

  var files = (command._.length ? command._ : ['test']).map(function (p) {
    if (/^\w+$/.test(p) && exists(p + '.js') && stats(p + '.js').isFile()) {
      return p + '.js';
    }

    if (/^\w+$/.test(p) && exists(p + '/index.js')) {
      return p + '/index.js';
    }

    return p;
  });

  glob(files, function (err, files) {
    (command.browser ? browser : node)(files);
  });
}

function browser (files) {
  files = files.map(function (p) {
    return path.join(process.cwd(), p);
  });

  if (command.launch) launchBrowser();
  require('../lib/browser')(files, command);
}

function node (files) {
  if (command.launch) return;

  files.forEach(function (file) {
    require(path.resolve(process.cwd(), file));
  });
}

function launchBrowser () {
  if (!command.launch) return;
  if (typeof command.launch != 'string') return launch.list();

  var url = 'http://' + command.host + ':' + command.port;

  if (command.grep) {
    url += '#grep:' + command.grep;
  }

  command.launch.split(',').forEach(function (browser) {
    launch(url, {
      browser: browser,
      headless: command.headless || false,
      proxy: command.proxy || undefined
    });
  });
}

function examples () {
  console.log(fs.readFileSync(path.join(__dirname, '../docs/examples')).toString());
}

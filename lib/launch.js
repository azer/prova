var debug = require("local-debug")('launch');
var launcher = require("browser-launcher");
var style = require("style-format");
var template = require("./node-template")('browser-launch');
var format = require("format-text");

module.exports = launch;
module.exports.list = list;

function list () {
  launcher.detect(function (avail) {
    console.log(style('\n  {cyan}Available Browsers:\n{reset} ' + avail.map(function (b) {
      return '\n  ' + b.name + ' {grey}v' + b.version + '{reset}';
    }).join('')) + '\n');
  });
}

function launch (url, options) {
  launcher(function (error, start) {
    if (error) return console.error(error);

    start(url, options, function (error, ps) {
      if (error) return console.error(error);

      process.on('exit', function(code) {
        ps.kill('SIGTERM');
      });

      var extras = '';
      if (options.headless) extras += ' headlessly';
      if (options.proxy) extras += ' through ' + options.proxy;

      console.log(format(template, {
        app: options.browser,
        url: url,
        extras: extras
      }));
    });
  });
}

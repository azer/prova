var debug = require("local-debug")('launch');
var launcher = require("browser-launcher");
var style = require("style-format");

module.exports = launch;
module.exports.list = list;

function list () {
  launcher.detect(function (avail) {
    console.log(style('\n  {bold}Available Browsers:{reset} %s\n'), avail.map(function (b) {
      return b.name + ' v' + b.version;
    }).join(', '));
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

      debug('Launched %s to visit %s%s.', options.browser, url, extras);
    });
  });
}

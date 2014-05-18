var debug = require("local-debug")('browserify');
var extname = require('path').extname;
var watchify = require('watchify');

var transformMap = {
  '.coffee': 'coffeeify',
  '.gs': 'gorillaify',
  '.iced': 'icsify',
  '.ls': 'liveify',
  '.coco': 'cocoify',
  '.ts': 'typescriptifier'
};

module.exports = function (files, command) {
  var ext = extname(files[0]);
  var transform = ext != '.js';
  var ret;

  if (transform) {
    ret = watchify({ extensions: [ext, '.js', '.json'] });
  } else {
    ret = watchify();
  }

  files.forEach(function (file) {
    ret.add(file);
  });

  if (transform) ret.transform(transformMap[ext]);

  if (command.transform && command.transform.length) {
    command.transform.split(',').forEach(function (name) {
      if (!name) return;
      debug('Transform "%s" enabled', name);
      ret.transform(name);
    });
  }

  if (command.plugin && command.plugin.length) {
    command.plugin.split(',').forEach(function (name) {
      if (!name) return;
      debug('Plugin "%s" enabled', name);
      ret.plugin(require(name));
    });
  }

  return ret;
};

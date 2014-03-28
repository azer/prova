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

module.exports = function (mainFile) {
  var ext = extname(mainFile);

  if (ext === '.js') {
    return watchify(mainFile);
  }

  var ret = watchify({extensions: [ext, '.js', '.json']});
  ret.add(mainFile)
    .transform(transformMap[ext]);
  return ret;
};

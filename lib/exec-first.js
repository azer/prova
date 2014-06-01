var debug = require("local-debug")('exec-first');
var exec = require("child_process").exec;

module.exports = execFirst;

function execFirst (command, callback) {
  debug('Calling "%s"', command);

  exec(command, function (error, stdout, stderr) {
    if (error) {
      throw error;
    }

    if (stdout) {
      debug('%s (stdout) > %s', command, stdout);
    }

    if (stderr) {
      debug('%s (stderr) > %s', command, stderr);
    }

    callback();
  });
}

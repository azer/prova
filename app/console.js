var socket = require("./socket");

module.exports = {
  override: all
};

function all () {
  var rpl = {};
  var name;
  for (name in console) {
    rpl[name] = override(name, console[name], console);
  }

  window.console = rpl;
}

function override (name, fn, console) {
  return function () {
    fn.apply(console, arguments);

    if (name == 'clear' || name == 'memory') {
      return;
    }

    var params = Array.prototype.slice.call(arguments);

    try {
      JSON.stringify(params);
    } catch (exc) {
      return;
    }

    socket.send({
      console: true,
      method: name,
      params: params
    });
  };
}

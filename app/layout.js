var dom = require("dom-children");
var on = require("on-off");
var select = require("select-dom");
var style = require("style-dom");
var classes = require("dom-classes");
var format = require("format-text");
var bindKey = require("bind-key");
var escape = require("escape-html");
var socket = require("./socket");
var grep = require("./grep");
var templates = require("./templates");
var options = require("./options");

on(window, 'resize', updatePositions);
on(window, 'hashchange', run);
socket(updateConn);

module.exports = {
  addError: addError,
  markTest: markTest,
  pass: pass,
  status: status,
  run: run,
  list: list
};

function addError (error) {
  var top = select('.top');

  if (!top) {
    setup();
    top = select('.top');
  };

  classes.add(select('.top'), 'failed');
  error.stack = format(templates.stack, error.stack.replace(/\n\s+/g, templates['stack-line']));

  error.code = format(templates.code, {
    'first-line-num': error.source[0].line,
    'first-line-source': escape(error.source[0].code),
    'second-line-num': error.source[1].line,
    'second-line-source': escape(error.source[1].code),
    'third-line-num': error.source[2].line,
    'third-line-source': escape(error.source[2].code)
  });

  if (error.expected != undefined) {
    error.diff = format(templates.diff, JSON.stringify(error.expected, null, " "), JSON.stringify(error.actual, null, " "));
  }

  if (addError.last != error.test) {
    error.title = '<h3>' + error.test +'</h3>';
    addError.last = error.test;
  } else {
    error.title = '';
  }

  dom.add(select('.results .errors'), templates.error, error);
}

function markTest (test) {
  var overview = select('.overview');
  if (overview) return;

  var list = select('.waiting .list');

  if (!list) {
    dom.add(select('.waiting h1'), templates.overview);
    list = select('.waiting .list');
  }

  dom.add(list, templates.test, {
    icon: '',
    name: test.name
  });
}

function setup () {
  dom.remove(select('.waiting'));

  var template = format(templates['layout'], templates);
  dom.add(document.body, template, {
    grep: grep() || '',
    conn: ''
  });

  on(select('.frame-button'), 'click', toggleFrame);
  on(select('.run-again'), 'click', run);

  updateConn();

  setupGrep();
  updateFramePosition();
}

function setupGrep () {
  var el = select('#grep');

  on(select('.grep label'), 'click', function () {
    el.focus();
  });

  bindKey(el, 'enter', function () {
    grep(el.value);
  });
}

function run () {
  addError.last = undefined;
  status('running');
  dom.add(document.body, templates['frame'], {
    options: options.stringify()
  });
}

function end () {
  classes.remove(select('.waiting'), '.running');
}

function pass (assertions) {
  setup();
  classes.add(select('.top'), 'passed');
  select('.pass').innerHTML = format(templates.pass, assertions);
  classes.add(select('.results'), 'passed');
}

function toggleFrame () {
  var results = select('.results');
  var frame = select('.frame');

  classes.toggle(results, 'open');
  classes.toggle(frame, 'open');

  updateFramePosition();
}

function updatePositions () {
  updateFramePosition();
}

function updateFramePosition () {
  var frame = select('.frame');
  var results = select('.results');

  if (!frame) return;

  var isOpen = classes.has(frame, 'open');
  var right = isOpen ? results.offsetWidth : 0;

  style(select('.frame-button'), 'right', right + 'px');

  if (!isOpen) return;

  style(frame, {
    width: results.offsetWidth - 1 + 'px',
    left: right + 'px',
    height: '100%'
  });
}

function status (msg) {
  var el = select('.status');

  if (!el) {
    document.body.innerHTML = format(templates.waiting, {
      message: msg
    });
    return;
  }

  el.innerHTML = msg;
  select('.waiting').className = 'waiting center ' + msg;
}

function list (tests) {
  var key;
  for (key in tests) {
    dom.add(select('.overview .list'), templates.test, {
      icon: tests[key] ?  '✓' : '✖',
      name: key
    });
  }
}

function updateConn (msg) {
  var el = select('.conn');
  if (!el) return;

  el.innerHTML = socket.isOpen() ? 'Watching File Changes' : 'Disconnected';
}

var debug = require("local-debug")('browser');
var http = require("http");
var browserify = require("browserify");
var routeMap = require("route-map");
var fs = require("fs");
var path = require("path");
var resumer = require("resumer");
var format = require("stream-format");
var formatText = require("format-text");
var concat = require("concat-stream");
var glob = require("glob").sync;
var parseUserAgent = require("user-agent-parser");
var prettifyError = require("prettify-error");
var WebSocket = require("faye-websocket");
var nodeTemplate = require("./node-template");
var nodeReporter = require("./node-reporter");
var transforms = require('./browserify-transforms');

var onSourceCodeChange = require("pubsub")();
var read;

var matchURL = routeMap({
  '/assets/app.js': app,
  '/assets/run.js': run,
  '/assets/:file': provaAsset,
  '/assets/in/:file': localAsset,
  '/assets/in/:directory/:file': localAsset,
  '/assets/in/:directory/:subdirectory/:file': localAsset,
  '/run': frame,
  '/': index
});

var templates = glob(provaPath('../../templates/*.html')).map(function (f) {
  return { name: path.basename(f, '.html'), filename: f };
});

var passTemplate = nodeTemplate('browser-passed-result');
var failTemplate = nodeTemplate('browser-failed-result');
var browserTemplate = nodeTemplate('browser-error-browser');
var errorTemplate = nodeTemplate('browser-error');
var errorNoStackTemplate = nodeTemplate('browser-error-no-stack');

module.exports = start;

function start (files, command) {
  var http = require('http');
  var server = http.createServer(route).listen(command.port, command.host);
  var restartNotification = JSON.stringify({ restart: true });

  read = transforms(files);
  read.on('update', onSourceCodeChange.publish);

  server.on('upgrade', function(request, socket, body) {
    var ws;

    if (WebSocket.isWebSocket(request)) {
      ws = new WebSocket(request, socket, body);

      onSourceCodeChange.subscribe(notify);

      ws.on('message', onMessage);

      ws.on('close', function(event) {
        ws = null;
        onSourceCodeChange.unsubscribe(notify);
      });
    }

    function notify () {
      ws.send(restartNotification);
    }
  });

  debug('Visit %s:%s with a browser to start running the tests.', command.host, command.port);

  function onMessage (msg) {
    msg = JSON.parse(msg.data);

    if (msg.result) {
      outputResult(msg);
      if (command.quit) process.exit(msg.failed);
      return;
    }

    if (msg.fail) return outputError(msg);
  }
}

function route (req, res) {
  var match = matchURL(req.url);
  if (!match) return notfound().pipe(res);
  match.fn(req, res, match);
};

function provaFile (file) {
  return fs.createReadStream(provaPath('../../app/' + file));
}

function provaAsset (req, res, match) {
  provaFile(match.params.file).on('error', function (error) {
    notfound().pipe(res);
  }).pipe(res);
}

function localAsset (req, res, match) {
  var filename = match.params.file;

  if (match.params.subdirectory) {
    filename = path.join(match.params.subdirectory, filename);
  }

  if (match.params.directory) {
    filename = path.join(match.params.directory, filename);
  }

  localFile(filename).on('error', function (error) {
    notfound().pipe(res);
  }).pipe(res);
}

function localFile (filename) {
  return fs.createReadStream(filename);
}

function index (req, res) {
  var waiting = format({
    message: 'loading'
  });

  fs.createReadStream(provaPath('../../templates/waiting.html'))
    .pipe(waiting);

  var render = format({
    layout: waiting
  });

  provaFile('index.html').pipe(render);
  render.pipe(res);
}

function build (filename) {
  var b = browserify();
  b.add(filename);
  return b;
}

function app (req, res) {
  convertTemplates();
  build(provaPath('../../app/index.js')).bundle().pipe(res);
}

function run (req, res) {
  var sourcemaps;
  var ind;

  var write = concat(function (build) {
    ind = build.indexOf('//# sourceMappingURL');
    build = build.slice(0, ind) + '\n\nwindow.__source_code = ' + JSON.stringify(build.slice(0, ind)) + ';\n\n' + build.slice(ind);
    res.end(build);
  });

  read.bundle({ debug: true }).on('error', function (error) {
    debug('Failed to browserify the source code. We\'re probably missing a module required. The error was:');
    process.stderr.write('\n    ');
    console.error(prettifyError(error, 0));
  }).pipe(write);
}

function notfound () {
  return resumer().queue('Not Found').end();
}

function frame (req, res) {
  provaFile('frame.html').pipe(res);
}

function convertTemplates () {
  var content = templates.map(function (template) {
    return {
      name: template.name,
      html: fs.readFileSync(template.filename).toString()
    };
  });

  content = content.map(function (template) {
    return 'exports["' + template.name + '"] = ' + JSON.stringify(template.html);
  });

  fs.writeFileSync(provaPath('../../app/templates.js'), content.join('\n'));
}

function provaPath (p) {
  return path.join(__filename, p);
}

process.on('uncaughtException', function (error) {
  console.error('\n', prettifyError(error) || error);
});

function outputError (msg) {
  var fail = msg.fail;
  var error = {
    message: fail.name,
    stack: fail.stack
  };

  console.log(formatText(error.stack ? errorTemplate : errorNoStackTemplate, {
    browser: formatUserAgent(msg.userAgent),
    title: fail.test,
    diff: diff(fail),
    error: nodeReporter.tab(prettifyError(error, undefined, fail.source) || '', '    ')
  }));
}

function outputResult (msg) {
  var failed = msg.result.failed;
  var template = failed ? failTemplate : passTemplate;

  console.log(formatText(template, msg.result) + '  ' + formatUserAgent(msg.userAgent));
}

function formatUserAgent (rawUserAgent) {
  var userAgent = parseUserAgent(rawUserAgent);

  return formatText(browserTemplate, {
    browser: userAgent.browser.name || '?',
    browserVersion: userAgent.browser.major || '?',
    engine: userAgent.engine.name || '?',
    engineVersion: userAgent.engine.version || '?',
    os: userAgent.os.name || '?',
    osVersion: userAgent.os.version || '?'
  })
}

function diff (fail) {
 return nodeReporter.diff(fail).slice(1).split('\n').map(function (line) {
   return line.slice(4);
 }).join('\n');
}

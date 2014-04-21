require('default-debug')('prova:browser');

var debug = require("local-debug")('browser');
var http = require("http");
var browserify = require("browserify");
var routeMap = require("route-map");
var fs = require("fs");
var path = require("path");
var resumer = require("resumer");
var format = require("stream-format");
var concat = require("concat-stream");
var glob = require("glob").sync;
var prettifyError = require("prettify-error");
var WebSocket = require("faye-websocket");
var onSourceCodeChange = require("pubsub")();
var property = require("property");
var transforms = require('./browserify-transforms');
var read;

var matchURL = routeMap({
  '/assets/app.js': app,
  '/assets/run.js': run,
  '/assets/:file': asset,
  '/run': frame,
  '/': index
});

var templates = glob(localPath('../../templates/*.html')).map(function (f) {
  return { name: path.basename(f, '.html'), filename: f };
});

module.exports = start;

function start (files, command) {
  var http = require('http');
  var server = http.createServer(route).listen(7559, '127.0.0.1');
  var restartNotification = JSON.stringify({ restart: true });

  read = transforms(files);
  read.on('update', onSourceCodeChange.publish);

  server.on('upgrade', function(request, socket, body) {
    var ws;

    if (WebSocket.isWebSocket(request)) {
      ws = new WebSocket(request, socket, body);

      onSourceCodeChange.subscribe(notify);

      ws.on('close', function(event) {
        ws = null;
        onSourceCodeChange.unsubscribe(notify);
      });
    }

    function notify () {
      ws.send(restartNotification);
    }
  });

  debug('Visit localhost:7559 with a browser to start running the tests.');
}

function route (req, res) {
  var match = matchURL(req.url);
  if (!match) return notfound().pipe(res);
  match.fn(req, res, match);
};

function file (file) {
  return fs.createReadStream(localPath('../../app/' + file));
}

function asset (req, res, match) {
  file(match.params.file).on('error', function (error) {
    notfound().pipe(res);
  }).pipe(res);
}

function index (req, res) {
  var waiting = format({
    message: 'loading'
  });

  fs.createReadStream(localPath('../../templates/waiting.html'))
    .pipe(waiting);

  var render = format({
    layout: waiting
  });

  file('index.html').pipe(render);
  render.pipe(res);
}

function build (filename) {
  var b = browserify();
  b.add(filename);
  return b;
}

function app (req, res) {
  convertTemplates();
  build(localPath('../../app/index.js')).bundle().pipe(res);
}

function run (req, res) {
  var sourcemaps;
  var ind;

  var write = concat(function (build) {
    ind = build.indexOf('//# sourceMappingURL');
    build = build.slice(0, ind) + '\n\nwindow.__source_code = ' + JSON.stringify(build.slice(0, ind)) + ';\n\n' + build.slice(ind);
    res.end(build);
  });

  read.bundle({ debug: true }).pipe(write);
}

function notfound () {
  return resumer().queue('Not Found').end();
}

function frame (req, res) {
  file('frame.html').pipe(res);
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

  fs.writeFileSync(localPath('../../app/templates.js'), content.join('\n'));
}

function localPath (p) {
  return path.join(__filename, p);
}

process.on('uncaughtException', function (error) {
  console.error('\n', prettifyError(error) || error);
});

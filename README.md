## prova

Node & Browser Test runner based on [Tape](http://github.com/substack/tape) and [Browserify](http://github.com/substack/node-browserify).

Screencasts: [node.gif](https://dl.dropboxusercontent.com/s/8yyepixc0bbtby3/prova-node.gif), [browser.gif](https://dl.dropboxusercontent.com/s/wtzt78riv7vcp7n/prova.gif), [both.gif](https://i.cloudup.com/4jGix1WEDH.gif)

Features and screenshots:

* Compatible with Tape.
* Comes with a builtin web app to run tests on browser.
* Outputs less when tests pass ([Node](https://i.cloudup.com/ausJApnH1v.png), [Browser](https://i.cloudup.com/OKebjyRMfU.png))
* Outputs more when tests fail ([Node](https://i.cloudup.com/R8KQ8Qwspz.png), [Browser](https://i.cloudup.com/nA08e0s60b.png))
* Browser app runs tests inside of an iframe [Screenshot](https://i.cloudup.com/5n8H9AqMrf.png)
* Uses [watchify](https://github.com/substack/watchify) to observe file changes and restart browser tests. [GIF Screenshot](https://dl.dropboxusercontent.com/s/wtzt78riv7vcp7n/prova.gif)
* Lets filtering test cases (e.g node test.js -g foobar)

## Install

```bash
$ npm install prova
```

## Usage

Example test:

```js
var test = require('prova')

test('timing test', function (t) {
  t.plan(2)

  t.equal(typeof Date.now, 'function')
  var start = Date.now()

  setTimeout(function () {
    t.equal(Date.now() - start, 100)
  }, 100)
})
```

In Node, it will output:

```
$ node test.js
Passed 1 test.
```

Or, in case it fails:

![](https://i.cloudup.com/R8KQ8Qwspz.png)

### In Browser

To run the tests in a web browser, just pass `-b` parameter:

```bash
$ node test.js -b
Visit localhost:7559 with a browser to start running the tests.
```

Then visit `localhost:7559` in your web browser:

![](https://i.cloudup.com/OKebjyRMfU.png)

In case it fails, it'll show:

![](https://i.cloudup.com/nA08e0s60b.png)

The web app uses [watchify](http://github.com/substack/watchify) to monitor file changes.
So, you won't have to reload the page when you modify a source code.

Prova runs the tests inside of an iframe. In case you test some UI stuff, you can open the iframe
by clicking the `<` button on the right:

![](https://i.cloudup.com/5n8H9AqMrf.png)

Just like the command-line tool, you can grep some specific tests to run, too:

![](https://i.cloudup.com/HNCzvv2JT8.png)

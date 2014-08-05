## prova

Node & Browser Test runner based on [Tape](http://github.com/substack/tape) and [Browserify](http://github.com/substack/node-browserify).

Screencasts: [node.gif](https://dl.dropboxusercontent.com/s/8yyepixc0bbtby3/prova-node.gif), [browser.gif](https://dl.dropboxusercontent.com/s/wtzt78riv7vcp7n/prova.gif), [both.gif](https://i.cloudup.com/4jGix1WEDH.gif), [headless browser](https://i.cloudup.com/lWWplVaKta.png)

Slides: [slides.com/azer/prova](http://slides.com/azer/prova)

Features and screenshots:

* Embeds [Tape](http://github.com/substack/tape)
* Comes with a builtin web app to run tests on browser, sourcemaps are enabled.
* Outputs less when tests pass ([Node](https://i.cloudup.com/ausJApnH1v.png), [Browser](https://i.cloudup.com/OKebjyRMfU.png))
* Outputs more when tests fail ([Node](https://i.cloudup.com/R8KQ8Qwspz.png), [Browser](https://i.cloudup.com/nA08e0s60b.png))
* Browser app runs tests inside of an iframe [Screenshot](https://i.cloudup.com/5n8H9AqMrf.png)
* Uses [watchify](https://github.com/substack/watchify) to observe file changes and restart browser tests. [GIF Screenshot](https://dl.dropboxusercontent.com/s/wtzt78riv7vcp7n/prova.gif)
* Lets filtering test cases (e.g node test.js -g foobar)
* Comes with [browser-launcher](https://github.com/substack/browser-launcher) for [launching browsers automatically and headless testing](#launching-browsers-and-headless-testing). ([Screenshot](https://i.cloudup.com/lWWplVaKta.png))
* Clickable error stacks on the browser: [Screenshot](https://i.cloudup.com/42iYw0WnPP.gif)
* Optional progress bar for slow tests: [Screenshot](https://i.cloudup.com/PJR44iZStH.gif)

## Install

```bash
$ npm install -g prova
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

### Multiple Tests

Prova comes with a command-line script when you install it globally;

```bash
$ npm install -g prova
```

And it allows you running multiple tests on both Node and browser;

```bash
$ prova test/foo.js test/bar.js
```

```bash
$ prova test/**/*.js -b
```

### Launching Browsers and Headless Testing

List the detected browsers;

```bash
$ prova -l
Available Browsers: safari v7.0.2, chrome v34.0.1847.116, phantom v1.9.7
```

And launch after publishing the tests:

```bash
$ prova -b -l safari
```

If your system has Xvfb, you can pass `-e` parameter to open the browser headlessly:

```bash
$ prova -b -l chrome -e
```

Or you can just run the tests on PhantomJS:

```bash
$ prova -b -l phantom
```

If you get `no matches for` errors and you think that your system has that browser, try removing [browser-launcher](https://github.com/substack/browser-launcher)'s config:

```bash
$ rm /Users/azer/.config/browser-launcher/config.json
```

### Browserify Transforms

Prova automatically applies [bunch of transforms](https://github.com/azer/prova/blob/master/lib/browserify-transforms.js#L4) by looking at the file extension. If you'd like to use a transform that doesn't exist in Prova by default, you can choose it with a parameter;

```bash
$ node test -b -t coffeeify
```

Multiple transforms can be specified using comma;

```bash
$ node test -b -t coffeeify,brfs,foo,bar
```

### Browserify Plugins

Pass Browserify plugins passing `-u` or `--plugin` parameter;

```bash
$ node test -b --plugin foo
```

Use comma to separate multiple plugins;

```bash
$ node test -b --plugin foo,bar
```

### Custom Frame Documents

When you're running the tests on the browser, Prova has an empty HTML template that loads and runs the JavaScript tests.
You can customize this HTML file with -f or --frame parameter:

```js
$ node test -b -f test.html
```

Click the arrow button on right middle to keep the frame open. You'll be seeing the HTML document and test results in the same screen.

### Manually Restarting Browser Tests

Prova watches for changes and automatically restarts the browser tests (inside in an iframe) but in case you need, there is an endpoint for restarting all the tests by hitting an endpoint;

```
$ curl localhost:7559/restart
```

### Loading Assets

You may need to load your images, web workers etc. for testing. Prova allows you to load assets from your current directory via the `/assets/in` endpoint. Let's say you'd like to load a file called "foobar.png":

```
$ curl http://localhost:7559/assets/in/foobar.png
```

Should work for you.

## Command-line

```
    USAGE

        prova [filenames] [options]

    OPTIONS

        -g     --grep         Run tests matching with given pattern

        -b     --browser      Publishes the tests on 0.0.0.0:7559
        -o     --port         Publish the tests on given port number.
        -d     --hostname     Publih the tests on given hostname.
        -l     --launch       List available browsers to launch or launch specified browser.
        -e     --headless     Launch the browser headlessly. (Requires xvfb)
        -r     --proxy        Launch the browser with specified proxy configuration.
        -q     --quit         Shut down the browser server once all the tests are done.
        -f     --frame        Specify a custom document to run tests on browser. e.g node test -b -f custom.html
        -x     --exec         Execute given commmand before running the tests.

        -t     --transform    Use given Browserify transforms. e.g node test -b -t coffeeify,brfs
        -u     --plugin       Use given Browserify plugins. e.g node test -b -u foo,bar

        -s     --progress     Show a progress bar. Useful when tests are running slow.

        -p     --tap          Output original Tap output without modifying anything.

        -v     --version      Show version and exit
        -h     --help         Show help and exit
               --examples     Show example commands and exit
```

## Example Commands

```
    EXAMPLES

        1. Run the tests on NodeJS.

           $ node test.js
           $ node test
           $ prova test/index.js
           $ prova

           All the above example commands will work same way. Prova assumes the filename of your test is either `test.js` or `test/index.js`

       2. Publish the tests on localhost:7559, so you can run the tests on a web browser.

          $ node test.js -b
          $ prova test -b
          $ prova -b

       3. Publish the tests on given host and port.

          $ node test.js -o 8080 -d foobar.net
          $ prova test.js -p 8080 -d foobar.net

       4. Publish the tests and launch a browser to automatically run the tests.

          $ node test.js -b -l chrome
          $ prova test.js -b -l chrome

       5. List the browsers that can be launched automatically.

          $ prova -l
          $ node test.js -l

       6. Run the tests with PhantomJS.

          $ node test.js -b -l phantom
          $ prova test.js -b -l phantom

       7. Run only specified tests with PhantomJS.

          $ node test.js -b -l phantom -g pattern
          $ prova test.js -b -l phantom -g pattern

       8. Launch Chrome headlessly using xvfb:

          $ node test -b -l chrome -e
          $ prova test -b -l chrome -e
```

var style = require("style-format");
var fs = require("fs");
var path = require("path");

module.exports = template;

function template (name) {
  var filename = path.join(__filename, "../../templates/node-" + name + ".txt");
  return style(fs.readFileSync(filename).toString());
}

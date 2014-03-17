var querystring = require("querystring");
var opts = querystring.parse(document.location.hash.slice(1), ';', ':');

module.exports = opts;

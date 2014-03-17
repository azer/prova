var through = require("through");
var tests = {};

var refine = through(map);

module.exports = refine;

function map (row) {
  if (row.type == 'end') {
    this.queue(row);
    return;
  }

  if (row.type == 'test') {
    tests[row.id] = row.name;
  }

  if (row.type != 'assert' || row.ok) {
    this.queue(row);
    return;
  }

  row.testName = tests[row.test];

  this.queue(row);
}

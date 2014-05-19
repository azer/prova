test = require '../../'

test 'assert object', (t)->
  t.plan 4
  t.equal 3.14, 3.14
  t.ok false
  t.notOk false
  t.deepEqual [3, 1, 4], [3, 1, 4]

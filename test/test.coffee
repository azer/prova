test = require "../"

test "written in cs", (assert) ->
  assert.ok true
  assert.notOk false
  assert.end()

test.skip "skipping a test failing", (assert) ->
  assert.notOk true
  assert.end()

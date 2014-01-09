
var path = require('path');
var exists = require('fs').existsSync;
var read = require('fs').readFileSync;
var exec = require('child_process').exec;
var resolve = require('bunyan').resolveLevel;
var assert = require('better-assert');

var file = path.join(__dirname, '../../examples', 'multiple-streams.js');

process.env.BUNYAN_ENABLED = 'multiple-streams';
process.env.BUNYAN_LEVEL = '*';

exec('node ' + file, function (err, stdout) {
  if (err) throw err;
  assert('' === stdout);
  assert(exists('./trace.log'));
  assert(exists('./debug.log'));
  assert(exists('./info.log'));
  assert(exists('./warn.log'));
  assert(exists('./error.log'));
  assert(exists('./fatal.log'));
});

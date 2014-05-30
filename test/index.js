"use strict";



module.exports = {
  'Is a function': function(test) {
    var scssLint = require('../lib/cli');
    test.ok(typeof scssLint === 'function', 'node-scss-lint should be a function');
    test.done();
  }
}

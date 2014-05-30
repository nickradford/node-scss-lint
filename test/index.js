"use strict";



module.exports = {
  'Is a function': function(test) {
    var scssLint = require('../lib/');
    test.ok(typeof scssLint == 'function', 'node-scss-lint should be a function');
    test.done();
  }
}

'use strict';
var path = require('path');
var Module = require('module');

var fs = require('fs');
var trace = require('./trace');

require('./runtime'); //  insert runtime stuff

require.extensions['.js'] = function(module, filename) {
  console.log('instrument', filename);
  var resolved = Module._resolveFilename(filename);

  if (resolved.indexOf('trace-hooks') === -1 &&
      resolved.indexOf('chai') === -1        &&
      resolved.indexOf('mocha') === -1  &&
      resolved.indexOf('minimatch') === -1 &&
      resolved.indexOf('rimraf') === -1 &&
      resolved.indexOf('babel') === -1 &&
      resolved.indexOf('regenerator') === -1 &&
      resolved.indexOf('glob') === -1) {
          return module._compile( trace(resolved), filename );
  } else {

          return module._compile( fs.readFileSync(resolved, 'UTF8'), filename );
  }
};

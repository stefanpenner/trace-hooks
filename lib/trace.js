var fs = require('fs');
var acorn = require('acorn');
var esotope = require('esotope');
var traverse = require('es-simpler-traverser');
var assert = require('assert');

var instrument = require('./instrument');
var addRuntime = require('./add-runtime');

module.exports = function(file) {
  assert(typeof file === 'string', 'expects path to file');
  var input = fs.readFileSync(file).toString();
  var output = acorn.parse(input, {
    ecmaVersion: 6,
    locations: true
  });

  var instrumented = instrument(file, output);
  var generated = esotope.generate(instrumented);

  return addRuntime(generated);
}

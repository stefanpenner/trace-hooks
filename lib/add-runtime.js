var path = require('path');
var runtime = require('fs').readFileSync(path.join(__dirname, 'runtime.js')).toString();

module.exports = function addRuntime(output) {
  return runtime + '\n' + output + '\n $_print_ticks($$_TICKS);';
}

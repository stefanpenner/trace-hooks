var $$_TICKS    = Object.create(null);

function $$Trace(path, startLine, startChar, stopLine, stopChar) {
  this.path = path;
  this.startLine = startLine;
  this.startChar = startChar;
  this.stopLine = stopLine;
  this.stopChar = stopChar;

  this.count = 0;

  this.key = this.generateKey();
}

$$Trace.prototype.type = 'probe';

$$Trace.prototype.generateKey = function() {
  return '' + this.startLine + ':' + this.startChar + ',' +
               this.stopLine + ':' + this.stopChar;
}

$$Trace.prototype.toJSON = function() {
  return {
    path: this.path,
    type: this.type,
    count: this.count,
    location: {
      startLine: this.startLine,
      startChar: this.startChar,
      stopLine: this.stopLine,
      stopChar: this.stopChar
    }
  };
};

function $_trace_probe(path, startLine, startChar, stopLine, stopChar) {
  var data = $$_TICKS[path] = ($$_TICKS[path] || Object.create(null));
  var _trace = new $$Trace(path, startLine, startChar, stopLine, stopChar)

  if (!data[_trace.key]) {
    data[_trace.key] = _trace;
  }

  data[_trace.key].count++;
}

function $_trace_Function(path, startLine, startChar, stopLine, stopChar, args) {
  // may not need this
}

function $_print_ticks(ticks) {
  Object.keys(ticks).forEach(function(path) {
    var file = ticks[path];

    console.log(JSON.stringify(
      Object.keys(file).map(function(traceName) {
        return file[traceName];
      })
    ));
  });
}

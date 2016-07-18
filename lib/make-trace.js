module.exports = function makeTrace(traceNode) {
  return function tracer(file, node, name) {
    var tick = JSON.parse(JSON.stringify(traceNode));

    var args = tick.body[0].expression.arguments;

    args[0].name = '"' + file + '"';
    args[1].name = '"' + (name || '<?>') + '"';
    args[2].name = node.start.line;
    args[3].name = node.start.column;
    args[4].name = node.end.line;
    args[5].name = node.end.column;

    return tick;
  };
};

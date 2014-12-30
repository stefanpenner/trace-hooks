#!/usr/bin/env node

var acorn = require('acorn');
var fs = require('fs');
var file = process.argv[2];
var input = fs.readFileSync(file).toString();
var traverse = require('es-simpler-traverser');
var esotope = require('esotope');

var traceTick = acorn.parse('$_trace_tick(file, startLine, startColumn, endLine, endColumn)');
var traceFunction = acorn.parse('$_trace_Function(file, startLine, startColumn, endLine, endColumn, arguments)');

var output = acorn.parse(input, {
  ecmaVersion: 6,
  locations: true
});

function makeTrace(traceNode) {
  return function tracer(file, node) {
    var tick = JSON.parse(JSON.stringify(traceNode));

    var args = tick.body[0].expression.arguments;

    args[0].name = '"' + file + '"';
    args[1].name = node.start.line;
    args[2].name = node.start.column;
    args[3].name = node.end.line;
    args[4].name = node.end.column;

    return tick;
  };
}

var makeTraceTick      = makeTrace(traceTick);
var makeTraceFunction  = makeTrace(traceFunction);

var visitors = {
  FunctionDeclaration: {
    enter: function(node) {
      node.body.body.unshift(makeTraceFunction(file, node.loc)); // conditionally if we want this
      node.body.body.unshift(makeTraceTick(file, node.loc));
    }
  },

  FunctionExpression: {
    enter: function(node) {
      node.body.body.unshift(makeTraceFunction(file, node.loc)); // conditionally if we want this
      node.body.body.unshift(makeTraceTick(file, node.loc));
    }
  },

  IfStatement: {
    enter: function(node) {
      node.consequent.body.unshift(makeTraceTick(file, node.consequent.loc));

      if (node.alternate && node.alternate.body) {
        node.alternate.body.unshift(makeTraceTick(file, node.alternate.loc));
      }
    }
  }
};

traverse(output, {
  exit: function(node) {
    var visitor = visitors[node.type]
    if (visitor && visitor.exit) visitor.exit(node);
  },

  enter: function(node) {
    var visitor = visitors[node.type]
    if (visitor && visitor.enter) visitor.enter(node);
  }
});

console.log(esotope.generate(output));

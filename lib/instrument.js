var acorn = require('acorn');
var fs = require('fs');
var traverse = require('es-simpler-traverser');

var traceTick = acorn.parse('$_trace_probe(file, startLine, startColumn, endLine, endColumn)');
var traceFunction = acorn.parse('$_trace_Function(file, startLine, startColumn, endLine, endColumn, arguments)');

var makeTrace = require('./make-trace');
var makeTraceTick = makeTrace(traceTick);
var makeTraceFunction  = makeTrace(traceFunction);

var visitors = {
  FunctionDeclaration: {
    enter: function(file, node) {
      node.body.body.unshift(makeTraceFunction(file, node.loc));
      node.body.body.unshift(makeTraceTick(file, node.loc));
    }
  },

  FunctionExpression: {
    enter: function(file, node) {
      node.body.body.unshift(makeTraceFunction(file, node.loc));
      node.body.body.unshift(makeTraceTick(file, node.loc));
    }
  },

  IfStatement: {
    enter: function(file, node) {

      if (node.consequent.type === 'ExpressionStatement') {
        // not supported yet
        return;
      }

      node.consequent.body.unshift(makeTraceTick(file, node.consequent.loc));

      if (node.alternate && node.alternate.body) {
        node.alternate.body.unshift(makeTraceTick(file, node.alternate.loc));
      }
    }
  },
  __proto__: null
};

module.exports = function instrument(file, ast) {
  traverse(ast, {
    exit: function(node) {
      var visitor = visitors[node.type]
      if (visitor && visitor.exit) visitor.exit(file, node);
    },
  
    enter: function(node) {
      var visitor = visitors[node.type]
      if (visitor && visitor.enter) visitor.enter(file, node);
    }
  });

  return ast;
};

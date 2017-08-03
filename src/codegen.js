const exprs = require('../testFiles/props')
const utils = require('./utils')

const expression = {
  Identifier(expr) {
    return expr.name
  },

  ArrowFunctionExpression(expr) {
    return expr.body
  },

  ObjectExpression(expr) {
    return expr.properties
  },

  ArrayExpression(expr) {
    return expr.elements
  },

  Property(expr) {
    return expr.value
  },

  Literal(expr) {
    return expr.value
  }
}

const statement = {
  BlockStatement(expr) {
    return expr.body
  },

  ReturnStatement(expr) {
    return expr.argument
  }
}

const base = Object.assign({}, expression, statement)

function walkNode(node, callback) {
  callback(node)

  Object.keys(node).forEach((key) => {
    const item = node[key]
    if (Array.isArray(item)) {
      item.forEach((sub) => {
        sub.type && walkNode(sub, callback)
      })
    }

    item && item.type && walkNode(item, callback)
  })
}

function CodeGenerator(rootNode) {
  const restuls = {}
}


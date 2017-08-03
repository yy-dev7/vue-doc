const fs = require('fs')
const acorn = require('acorn-object-spread')

const injectAcornJsx = require('acorn-jsx/inject')
const injectAcornObjectSpread = require('acorn-object-spread/inject')

injectAcornJsx(acorn)
injectAcornObjectSpread(acorn)

const walk = require("acorn/dist/walk")
const escodegen = require('escodegen')
const chalk = require('chalk')

const utils = require('./utils')

const log = console.log
const comments = []
const doc = {
  moduleName: '',
  props: [],
  events: []
}

function processComponent(file, fileType) {
  const scriptContent = getScriptContent(file, fileType)
  if (!scriptContent) {
    log(chalk.red('文件读取失败'))
    return
  }

  const ast = acorn.parse(scriptContent, {
    sourceType: 'module',
    ranges: false,
    locations: true,
    onComment: comments,
    plugins: {
      jsx: { allowNamespacedObjects: false },
      objectSpread: true
    }
  })
  const body = ast.body

  // 获取export表达式
  const exportDefaultDeclaration = body.find(item => item.type === 'ExportDefaultDeclaration')

  if (!exportDefaultDeclaration) return null

  // 获取export中所有的属性
  const properties = exportDefaultDeclaration.declaration.properties

  for (let i = 0, l = properties.length; i < l; i++) {
    const property = properties[i]
    const keyName = property.key.name

    if (keyName === 'name') {
      // vue的模块名
      doc.moduleName = property.value.value
    }

    // 获取props类型、注释、默认值
    if (keyName === 'props') {
      doc.props = getProps(property.value.properties)
    }

    // 获取methods中的$emit事件
    if (keyName === 'methods') {
      doc.events = getEvents(property.value)
    }
  }

  return doc
}

/**
 * [getProps description]
 * @param  {array} nodes
 * @return {object}
 */
function getProps(nodes) {
  const props = []
  const options = {
    format: {
      indent: {
        style: ''
      },
      json: true,
      newline: ''
    }
  }

  utils.each(nodes, function(node) {
    props.push(utils.merge({
      key: node.key.name,
      comment: findComment(node.loc)
    }, parseDefinition(escodegen.generate(node.value, options))))
  })

  return props
}

function parseDefinition(definition) {
  const results = {}
  const aryReg = /^\[(.*)\]$/
  const objReg = /\{(.*)\}/

  if (aryReg.test(definition)) {
    results.type = definition.match(aryReg)[1]
  } else if (objReg.test(definition)) {
    const matchType = /type\s?:([^,]*)/
    const object = utils.eval(definition)

    results.type = definition.match(matchType) && definition.match(matchType)[1]
    results.required = !!object.required
    if (typeof object.default === 'function') {
      results.default = object.default() ? JSON.stringify(object.default()) : '() => {}'
    } else if (typeof object.default === 'object') {
      results.default = JSON.stringify(object.default)
    } else {
      results.default = object.default
    }

  } else {
    results.type = definition
  }

  return results
}

function getEvents(methodsAst) {
  const events = []

  try {
    walk.simple(methodsAst, {
      CallExpression(node) {
        if (node.callee.property && node.callee.property.name === '$emit') {
          events.push({
            key: node.arguments[0].value,
            comment: findComment(node.loc)
          })
        }
      }
    })
  } catch(e) {}

  return events
}

/**
 * 查找对应的注释
 * @param  {Object} loc ast中的loc对象
 * @return {String} 注释内容或者空字符串
 */
function findComment(loc) {
  if (!loc) return null

  const textStartLine = loc.start.line
  const textStartColumn = loc.start.column

  for (let i = 0, l = comments.length; i < l; i++) {
    const commentLocEndLine = comments[i].loc.end.line
    const commentLocStartColumn = comments[i].loc.start.column

    // 找到在同一行右侧的注释 和上面一行的注释
    if (textStartLine === commentLocEndLine
      || (textStartLine - commentLocEndLine === 1 && commentLocStartColumn - textStartColumn <= 2)
      ) {
      return comments[i].value.trim()
    }
  }
  return ''
}

/**
 * 获取vue template中的script部分
 * @param  {String} template 文件读取到的内容
 * @return {String}          js内容
 */
function getScriptContent(template, fileType) {
  if (fileType === 'js') {
    return template
  }

  const EOL = process.platform === 'win32' ? '\r\n' : '\n'
  const regStr = `<script>([.${EOL}]*?)<\/script>`

  // const scriptContent = template.match(new RegExp(regStr, 'g'))
  const scriptContent = template.match(/<script[^>]*>((.|[\n\r])*)<\/script>/im)

  // 去掉script标签
  return scriptContent ? scriptContent[0].slice(8, -9) : null
}


module.exports = processComponent

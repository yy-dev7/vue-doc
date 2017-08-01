const fs = require('fs')
const acorn = require("acorn")
const escodegen = require('escodegen')
const utils = require('./utils')

const comments = []
const doc = {
  moduleName: '',
  props: [],
  events: []
}

function parseComponent(file) {
  return acorn.parse(getScriptContent(file), {
    sourceType: 'module',
    ranges: false,
    locations: true,
    onComment: comments
  })
}

function processComponent(file) {
  const ast = parseComponent(file)
  // console.log(comments)
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
      doc.events = getEvents(property.value.properties)
    }
  }

  // console.log(properties)
}

/**
 * [getProps description]
 * @param  {array} nodes
 * @return {object}
 */
function getProps(nodes) {
  // console.log(nodes)
  const results = []
  const loop = function() {

  }

  utils.each(nodes, function(node) {
    if (node.value.type === 'Identifier') {
      results.push({
        key: node.key.name,
        type: node.value.name,
        comment: findComment(node.loc)
      })
    }

    if (node.value.type === 'ObjectExpression') {
      results.push({
        key: node.key.name,
        val: escodegen.generate(node.value)
      })
    }
  })

  console.log(results)
}

function getEvents(properties) {

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

    if (textStartLine === commentLocEndLine
      || (textStartLine - commentLocEndLine === 1 && commentLocStartColumn - textStartColumn <= 2)
      ) {
      return comments[i].value
    }
  }
  return ''
}

/**
 * 获取vue template中的script部分
 * @param  {string} template 文件读取到的内容
 * @return {string}          js内容
 */
function getScriptContent(template) {
  const EOL = process.platform === 'win32' ? '\r\n' : '\n'
  const regStr = `<script>${EOL}(.*${EOL})*<\/script>`
  const scriptContent = template.match(new RegExp(regStr, 'g'))

  // 去掉script标签
  return scriptContent[0].slice(8, -9)
}


module.exports = processComponent

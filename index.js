const fs = require('fs')
const acorn = require("acorn")
const walk = require("acorn/dist/walk")
const file = fs.readFileSync('./modal.vue', 'utf8')

const comments = []
const ast = acorn.parse(getScriptContent(file), {
  sourceType: 'module',
  ranges: false,
  locations: true,
  onComment: comments
})

// traverse(ast.body)

walk.full(ast, node => {
  // console.log(node)
  console.dir(node, { depth: null });
  console.log('-----------------------------------')
})

// var buffer = Buffer.from(JSON.stringify(ast))
// fs.writeFile("file.js", buffer, 'binary', (err)=>{
//    if(err) console.log(err)
//    else console.log('File saved')
// })

// console.dir(comments, { depth: null });

/**
 * 获取vue template中的script部分
 * @param  {string} template 文件读取到的内容
 * @return {string}          js内容
 */
function getScriptContent(template) {
  const EOL = process.platform === 'win32' ? '\r\n' : '\n'
  const regStr = `<script>${EOL}(.*${EOL})*<\/script>`
  const scriptContent = file.match(new RegExp(regStr, 'g'))

  // 去掉script标签
  return scriptContent[0].slice(8, -9)
}

/**
 * 查找对应的注释
 * @param  {object} loc ast中的loc对象
 * @return {object}     注释对象或者null
 */
function findComment(loc) {
  if (!loc) return null

  const startLine = loc.start.line

  for (let i = 0, l = comments.length; i < l; i++) {
    if (startLine - comments[i].loc.end.line <= 1) {
      return comments[i]
    }
  }
  return null
}

function traverse(ast) {
  console.dir(ast.declaration)
}

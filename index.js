const fs = require('fs')
// const acorn = require("acorn")
// const walk = require("acorn/dist/walk")
const file = fs.readFileSync('./modal.vue', 'utf8')
const processComponent = require('./src/processComponent')

// const comments = []

// const ast = acorn.parse(getScriptContent(file), {
//   sourceType: 'module',
//   ranges: false,
//   locations: true,
//   onComment: comments
// })

processComponent(file)

// walk.full(ast, node => {
  // if (node.key && node.key.name === 'name') {
  //   console.log(node.value)
  // }

  // console.dir(node.type, { depth: null });
  // console.log('-----------------------------------')
// })

// var buffer = Buffer.from(JSON.stringify(ast))
// fs.writeFile("file.js", buffer, 'binary', (err)=>{
//    if(err) console.log(err)
//    else console.log('File saved')
// })

// console.dir(comments, { depth: null });



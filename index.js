const fs = require('fs')
const chalk = require('chalk')

const processComponent = require('./src/processComponent')
const render = require('./src/renderTemplate')
const log = console.log

function checkDirectorySync(directory) {
  try {
    fs.statSync(directory)
  } catch (e) {
    fs.mkdirSync(directory)
  }
}

module.exports = function(filePath) {
  const file = fs.readFileSync(filePath, 'utf8')
  const fileType = filePath.indexOf('.vue') > -1 ? 'vue' : 'js'
  const matchFileName = /^(?:.+)(?:\/|\\)([^\/\\]+).(?:vue|js)$/

  checkDirectorySync('./docs')
  const doc = processComponent(file, fileType)

  if (doc) {
    const fileName = doc.moduleName || filePath.match(matchFileName)[1] || 'anonymous'

    fs.writeFile(`./docs/${fileName}.html`, render(doc), (err) => {
      if (err) log(chalk.red(err))
      else log(chalk.green('文档创建成功!'))
    })
  }
}

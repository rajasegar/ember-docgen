const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const t = require('@babel/types')

const walkSync = require('walk-sync')

const fs = require('fs')
const path = require('path')

const {
  methodComment,
  compComment,
  fieldComment,
  computedComment,
}  = require('../src/utils/comments')

const VALUE_MAP = {
  NullLiteral: 'null',
  ArrayExpression: 'array',
  CallExpression: 'function',
  ObjectMethod: 'function',
}

const IGNORE_PROPS = [
  'layout',
  'classNames',
  'attributeBindings',
  'classNameBindings',
  'tagName',
  'actions',
]

const capitalize = n => n.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')

const genComments = props => {
  props.forEach(p => {
    if (!IGNORE_PROPS.includes(p.key.name)) {
      const _valueType = p.value ? p.value.type : p.type
      // console.log(_valueType);
      const valueType = VALUE_MAP[_valueType]

      if (p.value && p.value.type === 'CallExpression' && p.value.callee.name === 'computed') {
        p.leadingComments = [{type: 'CommentBlock', value: computedComment(p.key.name, p.key.name)}]
      } else if (_valueType === 'ObjectMethod') {
        p.leadingComments = [{type: 'CommentBlock', value: methodComment(p.key.name, p.params)}]
      } else {
        p.leadingComments = [{type: 'CommentBlock', value: fieldComment(p.key.name, p.key.name, valueType)}]
      }
    } else if (p.key.name === 'actions') {
      genComments(p.value.properties)
    }
  })
}

function writeComments(inputDir, pods = false) {
  const paths = walkSync(inputDir, {globs: ['**/*.js'], directories: false})

  paths.forEach(f => {
    let componentName = ''
    if (pods) {
      componentName = path.dirname(f).toUpperCase()
    } else {
      const capitalize = n => n.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')
      componentName = capitalize(path.basename(f, '.js'))
    }

    const outFile = `${inputDir}/${f}`
    const code = fs.readFileSync(`${inputDir}/${f}`, 'utf-8')
    const ast = parser.parse(code, {
      sourceType: 'module',
    })

    traverse(ast, {
      ExportDefaultDeclaration(p) {
        if (t.isExportDefaultDeclaration(p.node), {
          declaration: {
            callee: {
              object: {name: 'Component'},
              property: {name: 'extend'},
            },
          },
        }) {
          p.addComment('leading', compComment(componentName))

          const args = p.node.declaration.arguments
          if (args) {
            const len = args.length
            let props = args[len - 1].properties || []

            genComments(props)
          }
        }
      },

    })

    const output = generate(ast, {comments: true}, code).code
    fs.writeFile(outFile, output, err => {
      if (err) throw err
      console.log(`Comments added for component: ${outFile}`)
    })
  })
}

module.exports = writeComments;



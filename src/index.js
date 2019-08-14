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
  StringLiteral: 'string',
  NumberLiteral: 'number',
  BooleanLiteral: 'boolean'
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

const genComments = (props, json) => {
  props.forEach(p => {
    if (!IGNORE_PROPS.includes(p.key.name)) {

      json.props[p.key.name] = {};

      let prop = json.props[p.key.name];
      const _valueType = p.value ? p.value.type : p.type
      // console.log(_valueType);
      const valueType = VALUE_MAP[_valueType]

      prop.type = valueType;
      prop.description = "A description about the property";
      prop.defaultValue = {
        value:'',
        computed: false
      };
      
      if (p.value && p.value.type === 'CallExpression' && p.value.callee.name === 'computed') {
        p.leadingComments = [{type: 'CommentBlock', value: computedComment(p.key.name, p.key.name)}]
        prop.defaultValue.computed = true;
      } else if (_valueType === 'ObjectMethod') {
        p.leadingComments = [{type: 'CommentBlock', value: methodComment(p.key.name, p.params)}]
        prop.defaultValue.computed = true;
      } else {
        p.leadingComments = [{type: 'CommentBlock', value: fieldComment(p.key.name, p.key.name, valueType)}]
        const isPrimitiveValue  = (valueType === 'string' || valueType === 'number' || valueType === 'boolean' || valueType === 'null');
        prop.defaultValue.value =  isPrimitiveValue 
          ? (valueType === 'null') ? 'null' : p.value.value 
          : '';
      }
    } else if (p.key.name === 'actions') {
      genComments(p.value.properties, json)
    }
  })
}

function writeComments(inputDir, opts) {
  const { pods, json } = opts;
  const startTime = process.hrtime();

  const paths = walkSync(inputDir, {globs: ['**/*.js'], directories: false})
  console.log(`Processing ${paths.length} files...`);


  paths.forEach(f => {
  const docJson = { props: {}};
    let componentName = ''
    if (pods) {
      componentName = path.dirname(f).toUpperCase()
    } else {
      const capitalize = n => n.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')
      componentName = capitalize(path.basename(f, '.js'))
    }
    docJson.name = componentName;
    docJson.description = "A description about the component";

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

            genComments(props, docJson)
          }
        }
      },

    })


    const output = generate(ast, {comments: true}, code).code
    fs.writeFile(outFile, output, err => {
      if (err) throw err
    })

    if(json) {
    //console.log(docJson);
    const jsonFile = `${inputDir}/${path.basename(f, '.js')}.json`;
    fs.writeFile(jsonFile, JSON.stringify(docJson), err => { 
      if (err) throw err
    })


    }
  })

  console.log('All done.');
  const endTime = process.hrtime(startTime);
  const timeElapsed = (endTime[0] + endTime[1]/1e9).toFixed(3);
  console.log(`Time elapsed: ${timeElapsed} seconds`);
}

module.exports = writeComments;



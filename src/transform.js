const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const t = require('@babel/types')

const {
  methodComment,
  compComment,
  fieldComment,
  computedComment,
}  = require('../src/utils/comments')

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


function transform(code) {
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
  return output;
 
}

module.exports = transform;

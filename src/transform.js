const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const {
  methodComment,
  compComment,
  fieldComment,
  computedComment,
} = require('../src/utils/comments');

const { ignoreProps, valueMap } = require('../src/utils/constants');

const genComments = (props) => {
  props.forEach((p) => {
    if (!ignoreProps.includes(p.key.name)) {
      const _valueType = p.value ? p.value.type : p.type;
      const valueType = valueMap[_valueType];

      if (p.value && p.value.type === 'CallExpression' && p.value.callee.name === 'computed') {
        p.leadingComments = [
          { type: 'CommentBlock', value: computedComment(p.key.name, p.key.name) },
        ];
      } else if (_valueType === 'ObjectMethod') {
        p.leadingComments = [{ type: 'CommentBlock', value: methodComment(p.key.name, p.params) }];
      } else {
        p.leadingComments = [
          { type: 'CommentBlock', value: fieldComment(p.key.name, p.key.name, valueType) },
        ];
      }
    } else if (p.key.name === 'actions') {
      genComments(p.value.properties);
    }
  });
};

function transform(code, componentName) {
  const ast = parser.parse(code, {
    sourceType: 'module',
  });

  traverse(ast, {
    ExportDefaultDeclaration(p) {
      if (
        (t.isExportDefaultDeclaration(p.node),
        {
          declaration: {
            callee: {
              object: { name: 'Component' },
              property: { name: 'extend' },
            },
          },
        })
      ) {
        p.addComment('leading', compComment(componentName));

        const args = p.node.declaration.arguments;
        if (args) {
          const len = args.length;
          let props = args[len - 1].properties || [];
          genComments(props);
        }
      }
    },
  });

  const output = generate(ast, { comments: true }, code).code;
  return output;
}

module.exports = transform;

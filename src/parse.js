const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const { valueMap, ignoreProps } = require('../src/utils/constants');

const genComments = (props, json) => {
  props.forEach((p) => {
    if (!ignoreProps.includes(p.key.name)) {
      json.props[p.key.name] = {};

      let prop = json.props[p.key.name];
      const _valueType = p.value ? p.value.type : p.type;
      const valueType = valueMap[_valueType];

      prop.type = valueType;
      prop.description = 'A description about the property';
      prop.defaultValue = {
        value: '',
        computed: false,
      };

      if (p.value && p.value.type === 'CallExpression' && p.value.callee.name === 'computed') {
        prop.defaultValue.computed = true;
      } else if (_valueType === 'ObjectMethod') {
        prop.defaultValue.computed = true;
      } else {
        const isPrimitiveValue =
          valueType === 'string' ||
          valueType === 'number' ||
          valueType === 'boolean' ||
          valueType === 'null';
        prop.defaultValue.value = isPrimitiveValue
          ? valueType === 'null'
            ? 'null'
            : p.value.value
          : '';
      }
    } else if (p.key.name === 'actions') {
      genComments(p.value.properties, json);
    }
  });
};

function parse(src) {
  const docJson = { props: {} };

  docJson.name = 'MyComponent';
  docJson.description = 'A description about the component';

  const ast = parser.parse(src, {
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
        const args = p.node.declaration.arguments;
        if (args) {
          const len = args.length;
          let props = args[len - 1].properties || [];

          genComments(props, docJson);
        }
      }
    },
  });

  return docJson;
}

module.exports = parse;

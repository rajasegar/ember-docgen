const VALUE_MAP = {
  NullLiteral: 'null',
  ArrayExpression: 'array',
  CallExpression: 'function',
  ObjectMethod: 'function',
  StringLiteral: 'string',
  NumberLiteral: 'number',
  BooleanLiteral: 'boolean'
};

const IGNORE_PROPS = [
  'layout',
  'classNames',
  'attributeBindings',
  'classNameBindings',
  'tagName',
  'actions',
];

module.exports = {
  valueMap: VALUE_MAP,
  ignoreProps: IGNORE_PROPS
};

function scope(name) {
  return name[0] === '_' ? 'private' : 'public'
}

function methodComment(name, params) {
  let _params = '\b'

  _params = params.map(p => {
    return `* @param \{any\} ${p.name}`
  }).join('\n')

  return `*
* ${name}
*
* @method ${name}
* @${scope(name)}
${params.length > 0 ? _params : '*'}
`
}

const compComment = componentName => `*
  ${componentName} Usage:
  @class ${componentName}
  @namespace Components
  @extends Ember.Component
  @public
`

const fieldComment = (description, name, type) => `*
* ${description}
*
* @field ${name}
* @type ${type}
* @${scope(name)}
`

const computedComment = (description, name) => `*
* ${description}
*
* @computed ${name}
`

module.exports =  {
  methodComment,
  compComment,
  fieldComment,
  computedComment,
}

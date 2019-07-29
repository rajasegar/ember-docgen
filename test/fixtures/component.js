import Component from '@ember/component'
import layout from '../templates/components/es-accordion'
import {
  get,
  getProperties,
  set,
} from '@ember/object'
import {
  isPresent,
} from '@ember/utils'
import {computed} from '@ember/object'
import {
  A,
} from '@ember/array'

export default Component.extend({
  /**
  * The title of something
  *
  * @property layout
  * @type Identifier
  * @public
  */
  layout,

  /**
  * The title of something
  *
  * @property classNames
  * @type ArrayExpression
  * @public
  */
  classNames: ['accordion-group'],

  /**
  * The title of something
  *
  * @property activeItem
  * @type NullLiteral
  * @public
  */
  activeItem: null,
  /**
  * The title of something
  *
  * @property focusIndex
  * @type NullLiteral
  * @public
  */
  focusIndex: null,
  /**
  * The title of something
  *
  * @property accordionItemIndexes
  * @type NullLiteral
  * @public
  */
  accordionItemIndexes: null,

  /**
  * The title of something
  *
  * @property accordionState
  * @type CallExpression
  * @public
  */
  accordionState: computed('activeItem', 'focusIndex', function () {
    const {
      activeItem,
      focusIndex,
      actions,
    } = getProperties(this, [
      'activeItem',
      'focusIndex',
      'actions',
    ])

    return {
      activeItem,
      focusIndex,
      setActiveItem: actions.setActiveItem.bind(this),
      setFocusIndex: actions.setFocusIndex.bind(this),
      registerIndex: actions.registerIndex.bind(this),
    }
  }),

  /**
  * The title of something
  *
  * @property init
  * @type ObjectMethod
  * @public
  */
  init() {
    this._super(...arguments)

    set(this, 'accordionItemIndexes', [])
  },

  /**
  * The title of something
  *
  * @property keyDown
  * @type ObjectMethod
  * @public
  */
  keyDown(e) {
    const keyCode = get(e, 'keyCode')
    const focusIndex = get(this, 'focusIndex')

    if (isPresent(focusIndex)) {
      const targetIndex = this._resolveTargetItemIndex(keyCode)

      set(this, 'activeItem', targetIndex)
    }
  },

  /**
  * The title of something
  *
  * @property _resolveTargetItemIndex
  * @type ObjectMethod
  * @public
  */
  _resolveTargetItemIndex(keyCode) {
    const {
      accordionItemIndexes,
      activeItem,
      focusIndex,
    } = getProperties(this, [
      'accordionItemIndexes',
      'activeItem',
      'focusIndex',
    ])
    const first = Math.min(...accordionItemIndexes)
    const last = Math.max(...accordionItemIndexes)
    let itemIndexOfIndex = A(accordionItemIndexes).indexOf(activeItem)
    let targetIndex

    switch (keyCode) {
    case 38:
      if (activeItem === null || itemIndexOfIndex === -1) {
        targetIndex = focusIndex
      } else if (activeItem === first) {
        targetIndex = last
      } else {
        itemIndexOfIndex--
        targetIndex = accordionItemIndexes[itemIndexOfIndex]
      }
      break
    case 40:
      if (activeItem === null || itemIndexOfIndex === -1) {
        targetIndex = focusIndex
      } else if (activeItem === last) {
        targetIndex = first
      } else {
        itemIndexOfIndex++
        targetIndex = accordionItemIndexes[itemIndexOfIndex]
      }
      break
    case 36:
      targetIndex = first
      break
    case 35:
      targetIndex = last
      break
    case 13:
    case 32:
      if (activeItem !== focusIndex) {
        targetIndex = focusIndex
      } else {
        targetIndex = null
      }
      break
    default:
      targetIndex = activeItem
    }

    return targetIndex
  },

  /**
  * The title of something
  *
  * @property actions
  * @type ObjectExpression
  * @public
  */
  actions: {
    setActiveItem(accordionItemIndex) {
      return set(this, 'activeItem', accordionItemIndex)
    },

    setFocusIndex(accordionItemIndex) {
      set(this, 'focusIndex', accordionItemIndex)
    },

    registerIndex(accordionItemIndex) {
      get(this, 'accordionItemIndexes').push(accordionItemIndex)
    },
  },
})


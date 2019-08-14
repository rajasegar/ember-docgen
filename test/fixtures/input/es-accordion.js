import Component from '@ember/component';
import layout from '../templates/components/es-accordion';
import { get, getProperties, set } from '@ember/object';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { A } from '@ember/array';
/**
  EsAccordion Usage:
  @class EsAccordion
  @namespace Components
  @extends Ember.Component
  @public
*/

/**
  EsAccordion Usage:
  @class EsAccordion
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  layout,
  classNames: ['accordion-group'],

  /**
  * activeItem
  *
  * @field activeItem
  * @type null
  * @public
  */
  activeItem: null,

  /**
  * focusIndex
  *
  * @field focusIndex
  * @type null
  * @public
  */
  focusIndex: null,

  /**
  * accordionItemIndexes
  *
  * @field accordionItemIndexes
  * @type null
  * @public
  */
  accordionItemIndexes: null,

  /**
  * accordionState
  *
  * @computed accordionState
  */
  accordionState: computed('activeItem', 'focusIndex', function () {
    const {
      activeItem,
      focusIndex,
      actions
    } = getProperties(this, ['activeItem', 'focusIndex', 'actions']);
    return {
      activeItem,
      focusIndex,
      setActiveItem: actions.setActiveItem.bind(this),
      setFocusIndex: actions.setFocusIndex.bind(this),
      registerIndex: actions.registerIndex.bind(this)
    };
  }),

  /**
  * init
  *
  * @method init
  * @public
  *
  */
  init() {
    this._super(...arguments);

    set(this, 'accordionItemIndexes', []);
  },

  /**
  * keyDown
  *
  * @method keyDown
  * @public
  * @param {any} e
  */
  keyDown(e) {
    const keyCode = get(e, 'keyCode');
    const focusIndex = get(this, 'focusIndex');

    if (isPresent(focusIndex)) {
      const targetIndex = this._resolveTargetItemIndex(keyCode);

      set(this, 'activeItem', targetIndex);
    }
  },

  /**
  * _resolveTargetItemIndex
  *
  * @method _resolveTargetItemIndex
  * @private
  * @param {any} keyCode
  */
  _resolveTargetItemIndex(keyCode) {
    const {
      accordionItemIndexes,
      activeItem,
      focusIndex
    } = getProperties(this, ['accordionItemIndexes', 'activeItem', 'focusIndex']);
    const first = Math.min(...accordionItemIndexes);
    const last = Math.max(...accordionItemIndexes);
    let itemIndexOfIndex = A(accordionItemIndexes).indexOf(activeItem);
    let targetIndex;

    switch (keyCode) {
      case 38:
        if (activeItem === null || itemIndexOfIndex === -1) {
          targetIndex = focusIndex;
        } else if (activeItem === first) {
          targetIndex = last;
        } else {
          itemIndexOfIndex--;
          targetIndex = accordionItemIndexes[itemIndexOfIndex];
        }

        break;

      case 40:
        if (activeItem === null || itemIndexOfIndex === -1) {
          targetIndex = focusIndex;
        } else if (activeItem === last) {
          targetIndex = first;
        } else {
          itemIndexOfIndex++;
          targetIndex = accordionItemIndexes[itemIndexOfIndex];
        }

        break;

      case 36:
        targetIndex = first;
        break;

      case 35:
        targetIndex = last;
        break;

      case 13:
      case 32:
        if (activeItem !== focusIndex) {
          targetIndex = focusIndex;
        } else {
          targetIndex = null;
        }

        break;

      default:
        targetIndex = activeItem;
    }

    return targetIndex;
  },

  actions: {
    /**
    * setActiveItem
    *
    * @method setActiveItem
    * @public
    * @param {any} accordionItemIndex
    */
    setActiveItem(accordionItemIndex) {
      return set(this, 'activeItem', accordionItemIndex);
    },

    /**
    * setFocusIndex
    *
    * @method setFocusIndex
    * @public
    * @param {any} accordionItemIndex
    */
    setFocusIndex(accordionItemIndex) {
      set(this, 'focusIndex', accordionItemIndex);
    },

    /**
    * registerIndex
    *
    * @method registerIndex
    * @public
    * @param {any} accordionItemIndex
    */
    registerIndex(accordionItemIndex) {
      get(this, 'accordionItemIndexes').push(accordionItemIndex);
    }

  }
});
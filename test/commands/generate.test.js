const assert = require('assert');
const fs = require('fs');
const walkSync = require('walk-sync');
const transform = require('../../src/transform');

const { describe, it } = require('mocha');

describe('generate', function () {
  it('should generate Component comments', function () {
    const inputCode = `export default Component.extend({});`;

    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({});`;

    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should generate boolean field comments', function () {
    const inputCode = `
export default Component.extend({
  mybool: false
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  /**
  * mybool
  *
  * @field mybool
  * @type boolean
  * @public
  */
  mybool: false
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should generate null field comments', function () {
    const inputCode = `
export default Component.extend({
  mynull: null
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  /**
  * mynull
  *
  * @field mynull
  * @type null
  * @public
  */
  mynull: null
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should generate array field comments', function () {
    const inputCode = `
export default Component.extend({
  myarray: []
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  /**
  * myarray
  *
  * @field myarray
  * @type array
  * @public
  */
  myarray: []
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should generate string field comments', function () {
    const inputCode = `
export default Component.extend({
  mystr: 'hello'
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  /**
  * mystr
  *
  * @field mystr
  * @type string
  * @public
  */
  mystr: 'hello'
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should generate number field comments', function () {
    const inputCode = `
export default Component.extend({
  mynumber: 999
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  /**
  * mynumber
  *
  * @field mynumber
  * @type number
  * @public
  */
  mynumber: 999
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should ignore layout property', function () {
    const inputCode = `
export default Component.extend({
  layout
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  layout
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should ignore tagName property', function () {
    const inputCode = `
export default Component.extend({
  tagName
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  tagName
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should ignore actions property', function () {
    const inputCode = `
export default Component.extend({
  actions: {}
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  actions: {}
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should ignore classNames property', function () {
    const inputCode = `
export default Component.extend({
  classNames: ['class1', 'class2']
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  classNames: ['class1', 'class2']
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should ignore classNameBindings property', function () {
    const inputCode = `
export default Component.extend({
  classNameBindings: ['class1', 'class2']
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  classNameBindings: ['class1', 'class2']
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should ignore attributeBindings property', function () {
    const inputCode = `
export default Component.extend({
  attributeBindings: ['attr1', 'attr2']
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  attributeBindings: ['attr1', 'attr2']
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should generate method comments property', function () {
    const inputCode = `
export default Component.extend({
  mymethod() {
  }
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  /**
  * mymethod
  *
  * @method mymethod
  * @public
  *
  */
  mymethod() {}

});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should generate method comments with params property', function () {
    const inputCode = `
export default Component.extend({
  mymethod(param1, param2) {
  }
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  /**
  * mymethod
  *
  * @method mymethod
  * @public
  * @param {any} param1
  * @param {any} param2
  */
  mymethod(param1, param2) {}

});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should generate computed comments property', function () {
    const inputCode = `
export default Component.extend({
  mycomputed: computed('dep1', 'dep2', function() {})
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  /**
  * mycomputed
  *
  * @computed mycomputed
  */
  mycomputed: computed('dep1', 'dep2', function () {})
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it('should generate private field comments', function () {
    const inputCode = `
export default Component.extend({
  _mybool: false
});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({
  /**
  * _mybool
  *
  * @field _mybool
  * @type boolean
  * @private
  */
  _mybool: false
});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode, outputCode);
  });

  it.skip('should match output fixture', function (done) {
    const inputDir = 'test/fixtures/input';
    const outputDir = 'test/fixtures/output';
    const { spawn } = require('child_process');
    const ls = spawn('./bin/ember-docgen.js', ['test/fixtures/input']);

    ls.on('exit', (code) => {
      console.log(`child process exited with code ${code}`);

      const inputFixtures = walkSync(inputDir);
      inputFixtures.forEach((ifx) => {
        const inputCode = fs.readFileSync(`${inputDir}/${ifx}`, 'utf-8');
        const outputCode = fs.readFileSync(`${outputDir}/${ifx}`, 'utf-8');
        assert.strictEqual(inputCode, outputCode);
        done();
      });
    });
  });

  it('should accept single file arguments', function (done) {
    const inputFile = 'test/fixtures/input/es-accordion.js';
    const outputFile = 'test/fixtures/output/es-accordion.js';
    const { spawn } = require('child_process');
    const ls = spawn('./bin/ember-docgen.js', [inputFile]);

    ls.on('exit', (code) => {
      console.log(`child process exited with code ${code}`);

      const inputCode = fs.readFileSync(inputFile, 'utf-8');
      const outputCode = fs.readFileSync(outputFile, 'utf-8');
      assert.strictEqual(inputCode, outputCode);
      done();
    });
  });
});

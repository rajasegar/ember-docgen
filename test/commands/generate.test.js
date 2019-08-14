const assert = require('assert');
const fs = require('fs');
const walkSync = require('walk-sync');
const transform = require('../../src/transform');

describe('generate', function(){
  it('should generate Component comments', function(){

    const inputCode = `
export default Component.extend({});
`;
    const outputCode = `/**
  EmptyComponent Usage:
  @class EmptyComponent
  @namespace Components
  @extends Ember.Component
  @public
*/
export default Component.extend({});`;
    const commentedCode = transform(inputCode, 'EmptyComponent');
    assert.strictEqual(commentedCode,outputCode);

  });

  it('should generate field comments', function(){

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
    assert.strictEqual(commentedCode,outputCode);

  });

it('should ignore layout property', function(){

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
    assert.strictEqual(commentedCode,outputCode);

  });


  it.skip('should match output fixture', function(done){

    const inputDir = "test/fixtures/input";
    const outputDir = "test/fixtures/output";
    const { spawn } = require('child_process');
    const ls = spawn('./bin/ember-docgen.js', ['test/fixtures/input']);


    ls.on('exit', (code) => {
      console.log(`child process exited with code ${code}`);

      const inputFixtures = walkSync(inputDir);
      inputFixtures.forEach(ifx => {

        const inputCode = fs.readFileSync(`${inputDir}/${ifx}`, 'utf-8');
        const outputCode = fs.readFileSync(`${outputDir}/${ifx}`, 'utf-8');
        assert.strictEqual(inputCode,outputCode);
        done();


      });
    });


  });

  it.skip('should accept single file arguments', function(done) {

    const inputFile = "test/fixtures/input/es-accordion.js";
    const outputFile = "test/fixtures/output/es-accordion.js";
    const { spawn } = require('child_process');
    const ls = spawn('./bin/ember-docgen.js', [inputFile]);

    const inputCode = fs.readFileSync(inputFile, 'utf-8');
    const outputCode = fs.readFileSync(outputFile, 'utf-8');
    assert.strictEqual(inputCode,outputCode);
    done();
  });
})

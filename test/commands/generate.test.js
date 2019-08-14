const assert = require('assert');
const fs = require('fs');
const walkSync = require('walk-sync');

describe('generate', function(){
  it('should match output fixture', function(done){

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

  it('should accept single file arguments', function(done) {

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

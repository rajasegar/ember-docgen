#!/usr/bin/env node
// console.log(process.argv)
const program = require('commander');

program
.version('0.1.1','-v, --version', 'CLI Version')
.usage('[path...] [options]')
.description(
    'A CLI and toolbox to extract information from Ember component files for documentation generation purposes.'
)
.option('--pods', 'Enable support for POD style components')
.arguments('<path>')
.parse(process.argv);

const generate = require('../src/index');
if(program.args.length > 0) {
    generate(program.args[0], program.pods)
} else {
    program.help();
}


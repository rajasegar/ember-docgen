#!/usr/bin/env node
// console.log(process.argv)
const program = require('commander');

program
.version('0.1.4','-v, --version', 'CLI Version')
.usage('[path...] [options]')
.description(
    'A CLI and toolbox to extract information from Ember component files for documentation generation purposes.'
)
.option('--pods', 'Enable support for POD style components')
.option('--json', 'Generate JSON definition for components')
.arguments('<path>')
.parse(process.argv);

const generate = require('../src/index');
const opts = {
  pods: program.pods || false,
  json: program.json || false
};

if(program.args.length > 0) {
    generate(program.args[0], opts)
} else {
    program.help();
}


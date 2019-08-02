ember-docgen
============

A CLI and toolbox to extract information from Ember component files for documentation generation purposes. 

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ember-docgen.svg)](https://npmjs.org/package/ember-docgen)
[![Downloads/week](https://img.shields.io/npm/dw/ember-docgen.svg)](https://npmjs.org/package/ember-docgen)
[![License](https://img.shields.io/npm/l/ember-docgen.svg)](https://github.com/rajasegar/ember-docgen/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ember-docgen
$ ember-docgen COMMAND
running command...
$ ember-docgen (-v|--version|version)
ember-docgen/0.0.6 darwin-x64 node-v12.7.0
$ ember-docgen --help [COMMAND]
USAGE
  $ ember-docgen COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ember-docgen generate [PATH]`](#ember-docgen-generate-path)
* [`ember-docgen help [COMMAND]`](#ember-docgen-help-command)

## `ember-docgen generate [PATH]`

Describe the command here

```
USAGE
  $ ember-docgen generate [PATH]

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/generate.js](https://github.com/rajasegar/ember-docgen/blob/v0.0.6/src/commands/generate.js)_

## `ember-docgen help [COMMAND]`

display help for ember-docgen

```
USAGE
  $ ember-docgen help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_
<!-- commandsstop -->

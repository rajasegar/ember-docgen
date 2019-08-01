const {Command, flags} = require('@oclif/command')
const {spawn} = require('child_process')

class HelloCommand extends Command {
  constructor() {
    super()
    this.args = [
      {name: 'path'},
    ]
  }

  // static args = [
  //  { name: 'path'},
  // ]

  async run() {
    const {args} = this.parse(HelloCommand)
    this.log(args)
    // const name = flags.name || 'world'
    // this.log(`hello ${name} from ./src/commands/hello.js`)
    const ls = spawn('npx', ['ember-docgen-codemod', 'components', args.path])

    ls.stdout.on('data', data => {
      this.log(`${data}`)
    })

    ls.stderr.on('data', data => {
      this.log(`${data}`)
    })

    /*
    ls.on('close', code => {
        this.log(`child process exited with code ${code}`);
    })
    */
  }
}

HelloCommand.description = `Describe the command here
...
Extra documentation goes here
`

HelloCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = HelloCommand

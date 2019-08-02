const {Command, flags} = require('@oclif/command')
const {spawn} = require('child_process')

class GenerateCommand extends Command {

   static args = [
    { name: 'path'},
   ]

  async run() {
    const {args} = this.parse(GenerateCommand)
    //this.log(args)
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

GenerateCommand.description = `Describe the command here
...
Extra documentation goes here
`

GenerateCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = GenerateCommand
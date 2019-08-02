const {expect, test} = require('@oclif/test')

describe('generate', () => {
  test
  .stdout()
  .command(['generate'])
  .it('runs generate', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['generate', '--name', 'jeff'])
  .it('runs generate --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})

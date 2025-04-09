import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'sammuta',
  admin: true,
  superadmin: true,
  syntax: 'sammuta',
  desc: 'Sammuttaa botin, uudelleenkäynnistys vain komentolinjan kautta.',
  triggers: ['sammuta', 'shutdown'],
  type: ['admin']
}
const executor: CommandExecutor = async (message, client, args) => {
  setTimeout(() => message.delete(), 1000)
  setTimeout(() => {
    client.destroy()
    process.exit()
  }, 2500)
}

export default new Command({
  configuration,
  executor
})

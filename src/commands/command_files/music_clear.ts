import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
  requireGuild: true,
  name: 'clear',
  admin: false,
  syntax: 'clear',
  desc: 'tyhjentää musiikkijonon',
  triggers: ['clear'],
  type: ['music']
}

const executor: CommandExecutor = async (message, client, args) => {
  const guild = message.guild
  if (!guild) return
  queueMethods.clear({ guild: guild, message: message })
}

export default new Command({
  configuration,
  executor
})

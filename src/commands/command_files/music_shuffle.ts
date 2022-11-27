import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
  name: 'shuffle',
  admin: false,
  syntax: 'shuffle',
  desc: 'sekottaa jonon järjestyksen',
  triggers: ['suffle', 'shuffle', 'sekota'],
  type: ['music'],
  requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
  const guild = message.guild
  if (!guild) return
  queueMethods.shuffle({ guild: guild, message: message })
}

export default new Command({
  configuration,
  executor
})

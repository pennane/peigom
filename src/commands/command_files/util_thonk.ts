import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import Discord, { Permissions } from 'discord.js'

const configuration: CommandConfiguration = {
  name: 'thonk',
  admin: false,
  syntax: 'thonk',
  desc: 'Lähettää kanavalle animoidun thonkin.',
  triggers: ['thonk'],
  type: ['utility', 'fun']
}

const executor: CommandExecutor = async (message, client, args) => {
  const hasEmoji = client.emojis.cache.some(
    (emoji) => emoji.id === '443343009229045760'
  )

  let hasPermissions: boolean

  if (message.guild) {
    const channel = message.channel as Discord.TextChannel
    const permissions = message.guild.me
      ? channel.permissionsFor(message.guild.me)
      : null
    if (!permissions) {
      hasPermissions = false
    } else {
      hasPermissions = permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)
    }
  } else {
    hasPermissions = true
  }

  if (!hasEmoji || !hasPermissions) {
    message.channel.send(':thinking:')
    return
  }

  message.channel.send('<a:thonk:443343009229045760>')
}

export default new Command({
  configuration,
  executor
})

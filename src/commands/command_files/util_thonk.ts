import Discord, { ChannelType, PermissionFlagsBits } from 'discord.js'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'thonk',
  admin: false,
  syntax: 'thonk',
  desc: 'Lähettää kanavalle animoidun thonkin.',
  triggers: ['thonk'],
  type: ['utility', 'fun']
}

const executor: CommandExecutor = async (message, client, args) => {
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  const hasEmoji = client.emojis.cache.some(
    (emoji) => emoji.id === '443343009229045760'
  )

  let hasPermissions: boolean

  if (message.guild) {
    const channel = message.channel as Discord.TextChannel
    const permissions = message.guild.members.me
      ? channel.permissionsFor(message.guild.members.me)
      : null
    if (!permissions) {
      hasPermissions = false
    } else {
      hasPermissions = permissions.has(PermissionFlagsBits.UseExternalEmojis)
    }
  } else {
    hasPermissions = true
  }

  if (!hasEmoji || !hasPermissions) {
    channel.send(':thinking:')
    return
  }

  channel.send('<a:thonk:443343009229045760>')
}

export default new Command({
  configuration,
  executor
})

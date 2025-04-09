import { ChannelType } from 'discord.js'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'ping',
  admin: false,
  syntax: 'ping',
  desc: 'pingaa bottia',
  triggers: ['ping', 'pong'],
  type: ['utility'],
  requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return

  const embed = Command.createEmbed()
  embed
    .setTitle('Pong!')
    .setDescription(Date.now() - message.createdTimestamp + 'ms')
  channel.send({ embeds: [embed] })
}

export default new Command({
  configuration,
  executor
})

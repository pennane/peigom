import Discord, { ChannelType } from 'discord.js'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'sudo',
  admin: true,
  superadmin: true,
  syntax: 'sudo <#text-kanava> <teksti>',
  desc: 'Lähettää asettamasi viestin asettamallesi tekstikanavalle.',
  triggers: ['sudo'],
  type: ['admin']
}

const executor: CommandExecutor = async (message, client, args) => {
  const SyntaxEmbed = Command.syntaxEmbed({ configuration })
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  if (!args[2]) {
    setTimeout(() => {
      message.delete()
    }, 10000)
    const syntax = await channel.send({ embeds: [SyntaxEmbed] })
    setTimeout(() => {
      syntax.delete()
    }, 15000)

    return
  }

  const channelId = args[1].replace(/\D/g, '')
  const targetChannel = client.channels.cache.get(
    channelId
  ) as Discord.TextChannel

  if (!targetChannel || targetChannel.type !== ChannelType.GuildText) {
    setTimeout(() => {
      message.delete()
    }, 10000)
    const syntax = await channel.send({ embeds: [SyntaxEmbed] })
    setTimeout(() => {
      syntax.delete()
    }, 15000)
    return
  }

  const messageContent = args.slice(2).join(' ')

  targetChannel.send(messageContent)

  setTimeout(() => {
    message.delete()
  }, 10000)

  return
}

export default new Command({
  configuration,
  executor
})

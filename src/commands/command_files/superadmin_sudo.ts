import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import Discord from 'discord.js'

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
  if (!args[2]) {
    setTimeout(() => {
      message.delete()
    }, 10000)
    const syntax = await message.channel.send({ embeds: [SyntaxEmbed] })
    setTimeout(() => {
      syntax.delete()
    }, 15000)

    return
  }

  const channelId = args[1].replace(/\D/g, '')
  const targetChannel = client.channels.cache.get(
    channelId
  ) as Discord.TextChannel

  if (!targetChannel || targetChannel.type !== 'GUILD_TEXT') {
    setTimeout(() => {
      message.delete()
    }, 10000)
    const syntax = await message.channel.send({ embeds: [SyntaxEmbed] })
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

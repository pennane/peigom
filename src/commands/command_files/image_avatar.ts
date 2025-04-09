import { ChannelType } from 'discord.js'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'avatar',
  admin: false,
  syntax: 'avatar {@kuka}',
  desc: 'Esittää oman, tai muun avatarin',
  triggers: ['avatar'],
  type: ['image']
}

const executor: CommandExecutor = async (message, client, args) => {
  const embed = Command.createEmbed()
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  if (args.length === 1) {
    const user = message.author
    const image = user.displayAvatarURL({
      extension: 'png',
      size: 4096
    })

    embed.setTitle(`Käyttäjän ${user.username} avatari.`).setImage(image)
    channel.send({ embeds: [embed] })
    return
  }

  if (!args[1].startsWith('<@')) {
    return message.reply(`Et käyttänyt \`@käyttäjä\` syntaksia.`)
  }

  if (!message.guild) return

  const mentioned = message.mentions.members
    ? message.mentions.members.first()
    : null

  if (!mentioned) {
    return message.reply(`Käyttäjä jonka tägäsit on rikki.`)
  }

  const member = message.guild.members.cache.get(mentioned.id)

  if (!member) {
    return message.reply(`${args[1]} ei ole tällä severillä`)
  }

  const image = member.user.displayAvatarURL({
    extension: 'png',
    size: 4096
  })

  embed.setTitle(`Käyttäjän ${member.displayName} avatari.`)
  embed.setImage(image)

  channel.send({ embeds: [embed] })
  return
}

export default new Command({
  configuration,
  executor
})

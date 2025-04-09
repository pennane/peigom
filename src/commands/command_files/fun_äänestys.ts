import { ChannelType } from 'discord.js'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'äänestys',
  admin: false,
  syntax: 'äänestys <Joo/ei kysymys>',
  desc: 'Luo very ez äänestyksiä',
  triggers: ['vote', 'äänestys'],
  type: ['fun']
}

const executor: CommandExecutor = async (message, client, args) => {
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  if (args.length === 1) {
    return channel.send({
      embeds: [Command.syntaxEmbed({ configuration })]
    })
  }

  const voteArgs = args.slice(1)

  const embed = Command.createEmbed()

  embed
    .setTitle(`Käyttäjän ${message.author.username} äänestys`)
    .setDescription(`${voteArgs.join(' ')}`)
    .setTimestamp()

  const voteMessage = await channel.send({ embeds: [embed] })
  message.deletable ? message.delete() : null
  await voteMessage.react('👍')
  voteMessage.react('👎')

  return
}

export default new Command({
  configuration,
  executor
})

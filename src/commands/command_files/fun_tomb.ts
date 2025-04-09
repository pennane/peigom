import { ChannelType } from 'discord.js'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'tomb',
  admin: false,
  syntax: 'tomb',
  desc: 'Lähettää kanavalle tomb viestit.',
  triggers: ['tomb'],
  type: ['fun']
}

const executor: CommandExecutor = async (message, client, args) => {
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  const embed = Command.createEmbed()
  embed
    .setTitle(`OLET TEHNYT TUHMUUKSIA!`)
    .setDescription('NYT RIITTAEAE VANDALISOINTI')
  const sentMessage = await channel.send({ embeds: [embed] })
  setTimeout(async () => {
    embed.setDescription(
      'NYT RIITTAEAE VANDALISOINTI\nTAEAE ON NYT TEIKAEN HAUTA'
    )
    const editedMessage = await sentMessage.edit({ embeds: [embed] })
    setTimeout(function () {
      embed.setDescription(
        'NYT RIITTAEAE VANDALISOINTI\nTAEAE ON NYT TEIKAEN HAUTA\nOLET HERAETTYNYT MEIDAET'
      )
      editedMessage.edit({ embeds: [embed] })
    }, 3000)
  }, 3000)
}

export default new Command({
  configuration,
  executor
})

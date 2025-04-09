import { ChannelType } from 'discord.js'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'puhista',
  admin: true,
  syntax: 'puhista <määrä (1-99)>',
  desc: 'Poistaa annetun määrän viestejä kanavalta.',
  triggers: ['puhista', 'puhdista'],
  type: ['admin']
}

const executor: CommandExecutor = async (message, client, args) => {
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return

  const embed = Command.createEmbed().setTitle('Botin kommentti:')

  const amountToRemove = Number(args[1])

  if (
    isNaN(amountToRemove) ||
    !isFinite(amountToRemove) ||
    amountToRemove < 1 ||
    amountToRemove > 99
  ) {
    const syntaxEmbed = Command.syntaxEmbed({ configuration })
    channel.send({ embeds: [syntaxEmbed] })
    return
  }

  await channel.bulkDelete(amountToRemove + 1)
  embed.setDescription(`Poistin ${amountToRemove} viestiä.`)
  channel
    .send({ embeds: [embed] })
    .then((message) => setTimeout(() => message.delete(), 8000))
}

export default new Command({
  configuration,
  executor
})

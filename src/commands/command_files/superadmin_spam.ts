import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'spam',
  admin: true,
  superadmin: true,
  syntax: 'spam <@pelaaja> <määrä> <viesti>',
  desc: 'Lähettää asettamasi viestin asettamallesi pelaajalle asettamasi monta kertaa.',
  triggers: ['spam'],
  type: ['admin']
}

const executor: CommandExecutor = async (message, client, args) => {
  const SyntaxEmbed = Command.syntaxEmbed({ configuration })

  if (!args[3]) {
    const syntax = await message.channel.send({ embeds: [SyntaxEmbed] })
    setTimeout(() => {
      syntax.delete()
      message.delete()
    }, 15000)
    return
  }

  const messageAmount = Number(args[2])

  if (isNaN(messageAmount) || messageAmount > 100) {
    const embed = await message.channel.send({
      embeds: [
        Command.createEmbed()
          .setTitle('Epäkelpo määrä viestejä')
          .setDescription('ettäs tiedät')
      ]
    })
    setTimeout(() => {
      embed.delete()
      message.delete()
    }, 15000)

    return
  }

  const userid = args[1].replace(/\D/g, '')

  if (!message.guild?.members.cache.get(userid)) {
    const syntax = await message.channel.send({ embeds: [SyntaxEmbed] })
    setTimeout(() => {
      syntax.delete()
      message.delete()
    }, 15000)
    return
  }

  const messageContent = args.slice(3).join(' ')

  const targetUser = message.guild.members.cache.get(userid)

  if (!targetUser) {
    const embed = await message.channel.send({
      embeds: [
        Command.createEmbed()
          .setTitle('Epäkelpo vastaanottaja')
          .setDescription('ettäs tiedät')
      ]
    })
    setTimeout(() => {
      embed.delete()
      message.delete()
    }, 15000)
    return
  }

  for (let i = 0; i < messageAmount; i++) {
    setTimeout(() => {
      if (!targetUser) return
      targetUser.send(messageContent)
    }, 300 * i)
  }

  setTimeout(() => {
    message.delete()
  }, 5000)
}

export default new Command({
  configuration,
  executor
})

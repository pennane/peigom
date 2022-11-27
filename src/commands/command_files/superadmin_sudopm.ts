import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
  name: 'sudopm',
  admin: true,
  superadmin: true,
  syntax: 'sudopm <@käyttäjä> <teksti>',
  desc: 'Lähettää asettamasi viestin asettamallesi pelaajalle.',
  triggers: ['sudopm'],
  type: ['admin']
}

const executor: CommandExecutor = async (message, client, args) => {
  const SyntaxEmbed = Command.syntaxEmbed({ configuration })

  if (!args[2]) {
    setTimeout(() => {
      message.delete()
    }, 10000)
    const notifyMessage = await message.channel.send({ embeds: [SyntaxEmbed] })
    setTimeout(() => {
      notifyMessage.delete()
    }, 15000)

    return
  }

  const userId = args[1].replace(/\D/g, '')

  const sudoUser = message.guild?.members.cache.get(userId)

  if (!sudoUser) {
    setTimeout(() => {
      message.delete()
    }, 1200)
    const notifyMessage = await message.channel.send({ embeds: [SyntaxEmbed] })
    setTimeout(() => {
      notifyMessage.delete()
    }, 15000)
    return
  }

  const messageContent = args.slice(2).join(' ')

  sudoUser.send(messageContent)
  setTimeout(() => {
    message.delete()
  }, 3200)
}

export default new Command({
  configuration,
  executor
})

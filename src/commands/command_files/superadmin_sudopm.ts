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
    let SyntaxEmbed = Command.syntaxEmbed({ configuration })

    if (!args[2]) {
        message.delete({ timeout: 10000 })
        let notifyMessage = await message.channel.send(SyntaxEmbed)
        notifyMessage.delete({ timeout: 15000 })

        return
    }

    let userId = args[1].replace(/\D/g, '')

    let sudoUser = message.guild?.members.cache.get(userId)

    if (!sudoUser) {
        message.delete({ timeout: 1200 })
        let notifyMessage = await message.channel.send(SyntaxEmbed)
        notifyMessage.delete({ timeout: 15000 })
        return
    }

    let messageContent = args.slice(2).join(' ')

    sudoUser.send(messageContent)
    message.delete({ timeout: 3200 })
}

export default new Command({
    configuration,
    executor
})

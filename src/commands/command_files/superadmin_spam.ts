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
    let SyntaxEmbed = Command.syntaxEmbed({ configuration })

    if (!args[3]) {
        let syntax = await message.channel.send(SyntaxEmbed)
        syntax.delete({ timeout: 15000 })
        message.delete({ timeout: 15000 })
        return
    }

    let messageAmount = Number(args[2])

    if (isNaN(messageAmount) || messageAmount > 100) {
        let embed = await message.channel.send(
            Command.createEmbed().setTitle('Epäkelpo määrä viestejä').setDescription('ettäs tiedät')
        )
        embed.delete({ timeout: 15000 })
        message.delete({ timeout: 15000 })
        return
    }

    let userid = args[1].replace(/\D/g, '')

    if (!message.guild?.members.cache.get(userid)) {
        let syntax = await message.channel.send(SyntaxEmbed)
        syntax.delete({ timeout: 15000 })
        message.delete({ timeout: 15000 })
        return
    }

    let messageContent = args.slice(3).join(' ')

    let targetUser = message.guild.members.cache.get(userid)

    if (!targetUser) {
        let embed = await message.channel.send(
            Command.createEmbed().setTitle('Epäkelpo vastaanottaja').setDescription('ettäs tiedät')
        )
        embed.delete({ timeout: 15000 })
        message.delete({ timeout: 15000 })
        return
    }

    for (let i = 0; i < messageAmount; i++) {
        setTimeout(() => {
            if (!targetUser) return
            targetUser.send(messageContent)
        }, 300 * i)
    }

    message.delete({ timeout: 5000 })
}

export default new Command({
    configuration,
    executor
})

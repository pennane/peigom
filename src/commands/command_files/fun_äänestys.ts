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
    if (args.length === 1) {
        return message.channel.send({ embeds: [Command.syntaxEmbed({ configuration })] })
    }

    let voteArgs = args.slice(1)

    let embed = Command.createEmbed()

    embed
        .setTitle(`Käyttäjän ${message.author.username} äänestys`)
        .setDescription(`${voteArgs.join(' ')}`)
        .setTimestamp()

    let voteMessage = await message.channel.send({ embeds: [embed] })
    message.deletable ? message.delete() : null
    await voteMessage.react('👍')
    voteMessage.react('👎')

    return
}

export default new Command({
    configuration,
    executor
})

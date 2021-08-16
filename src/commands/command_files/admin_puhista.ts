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
    if (message.channel.type !== 'GUILD_TEXT') return

    let embed = Command.createEmbed().setTitle('Botin kommentti:')

    let amountToRemove = Number(args[1])

    if (isNaN(amountToRemove) || !isFinite(amountToRemove) || amountToRemove < 1 || amountToRemove > 99) {
        let syntaxEmbed = Command.syntaxEmbed({ configuration })
        message.channel.send({ embeds: [syntaxEmbed] })
        return
    }

    await message.channel.bulkDelete(amountToRemove + 1)
    embed.setDescription(`Poistin ${amountToRemove} viestiä.`)
    message.channel.send({ embeds: [embed] }).then((message) => setTimeout(() => message.delete(), 8000))
}

export default new Command({
    configuration,
    executor
})

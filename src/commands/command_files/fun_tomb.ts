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
    let embed = Command.createEmbed()
    embed.setTitle(`OLET TEHNYT TUHMUUKSIA!`).setDescription('NYT RIITTAEAE VANDALISOINTI')
    let sentMessage = await message.channel.send(embed)
    setTimeout(async () => {
        embed.setDescription('NYT RIITTAEAE VANDALISOINTI\nTAEAE ON NYT TEIKAEN HAUTA')
        let editedMessage = await sentMessage.edit(embed)
        setTimeout(function () {
            embed.setDescription('NYT RIITTAEAE VANDALISOINTI\nTAEAE ON NYT TEIKAEN HAUTA\nOLET HERAETTYNYT MEIDAET')
            editedMessage.edit(embed)
        }, 3000)
    }, 3000)
}

export default new Command({
    configuration,
    executor
})

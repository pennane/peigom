const dictionary = require('urban-dictionary')
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
    name: 'urban',
    admin: false,
    syntax: 'urban <sana>',
    desc: 'Hakee selitteen sanalle',
    triggers: ['urban', 'dictionary', 'define'],
    type: ['fun']
}

const executor: CommandExecutor = async (message, client, args) => {
    if (!args[1]) {
        message.channel.send({ embeds: [Command.syntaxEmbed({ configuration })] })
        return
    }

    let toDefine = args.slice(1).join(' ')

    try {
        let results = await dictionary.define(toDefine)
        let entry = results[0]
        let embed = Command.createEmbed()
        embed.setTitle('Urbanaba Sanababa')
        embed.addField(
            toDefine,
            `${entry.definition.replace(/\[|\]/g, '')}\n*${entry.example.replace(/\[|\]/g, '')}*\n[Link](${
                entry.permalink
            })`
        )
        embed.setFooter(entry.author, 'https://arttu.pennanen.org/file/thonk.gif')
        embed.setTimestamp()
        message.channel.send({ embeds: [embed] })
    } catch {
        message.channel.send(`Ei löytyny selitystä sanomalle ${toDefine}`)
    }
}

export default new Command({
    configuration,
    executor
})

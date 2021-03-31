import Command, { CommandExecutor, CommandConfiguration } from '../Command'
import fs from 'fs'

if (!fs.existsSync('./data/disabledChannels/channels.json')) {
    fs.writeFileSync('./data/disabledChannels/channels.json', '{}')
}

export let disabledChannels = JSON.parse(fs.readFileSync('./data/disabledChannels/channels.json', 'utf8'))

const configuration: CommandConfiguration = {
    name: 'bottitoimiitäällä',
    admin: true,
    syntax: 'bottitoimiitäällä <#channel> <ei/joo> tai bottitoimiitäällä <ei/joo>',
    desc: 'Laita botti pois päältä / päälle per tekstikanava',
    triggers: ['bottitoimiitäällä'],
    type: ['admin', 'utility'],
    requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
    const sendHowToUse = () => {
        let embed = Command.syntaxEmbed({ configuration })
        message.channel.send(embed).catch((err) => console.info(err))
    }

    if (!message.guild) return

    if (!args[1] || args[1] === null) {
        sendHowToUse()
        return
    }

    let channelId: string

    if (!args[2]) {
        channelId = message.channel.id
    } else {
        let matched = args[1].match(/\d+/)
        if (!matched) return sendHowToUse()
        channelId = matched[0]
    }

    let targetChannel = message.guild.channels.cache.find((channel) => channel.id === channelId)

    if (!targetChannel) {
        sendHowToUse()
        return
    }

    if (!args[2]) {
        if (args[1] === 'joo') {
            disabledChannels[channelId] = 'listening'
            message.channel.send(' Peigom kuuntelee taas <#' + channelId + '>')
        } else if (args[1] === 'ei') {
            disabledChannels[channelId] = 'disabled'
            message.channel.send(' Peigom ei enää kuuntele <#' + channelId + '>')
        } else {
            sendHowToUse()
        }
    } else {
        if (args[2] === 'joo') {
            disabledChannels[channelId] = 'listening'
            message.channel.send(' Peigom kuuntelee taas ' + args[1])
        } else if (args[2] === 'ei') {
            disabledChannels[channelId] = 'disabled'
            message.channel.send(' Peigom ei enää kuuntele ' + args[1])
        } else {
            sendHowToUse()
        }
    }

    fs.writeFile('./data/disabledChannels/channels.json', JSON.stringify(disabledChannels), function (err) {
        if (err) {
            return console.info(err)
        }
    })
}

export default new Command({
    configuration,
    executor
})

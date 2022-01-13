import { Util } from 'discord.js'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
    name: 'emojis',
    admin: false,
    superadmin: true,
    syntax: 'emojis',
    desc: 'Lähettää kanavalle kaikki botin tuntemat emojit',
    triggers: ['emojis', 'emojit'],
    type: ['utility', 'fun']
}

const executor: CommandExecutor = async (message, client, args) => {
    let emojis = client.emojis.cache
    let emojiMessage = ''
    emojis.forEach((emoji) => {
        if (!emoji.available) return
        emojiMessage += `${emoji.toString()} `
    })
    let splitMessage = Util.splitMessage(emojiMessage, { char: ' ' })
    splitMessage.forEach((content) => {
        message.channel.send(content)
    })
}

export default new Command({
    configuration,
    executor
})

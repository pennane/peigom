import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
    name: 'emojis',
    admin: false,
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
    message.channel.send(emojiMessage, { split: { char: ' ' } })
}

export default new Command({
    configuration,
    executor
})

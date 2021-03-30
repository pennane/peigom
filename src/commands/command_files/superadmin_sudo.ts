import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import Discord from 'discord.js'

const configuration: CommandConfiguration = {
    name: 'sudo',
    admin: true,
    superadmin: true,
    syntax: 'sudo <#text-kanava> <teksti>',
    desc: 'Lähettää asettamasi viestin asettamallesi tekstikanavalle.',
    triggers: ['sudo'],
    type: ['admin']
}

const executor: CommandExecutor = async (message, client, args) => {
    let SyntaxEmbed = Command.syntaxEmbed({ configuration })
    if (!args[2]) {
        message.delete({ timeout: 10000 })
        let syntax = await message.channel.send(SyntaxEmbed)
        syntax.delete({ timeout: 15000 })

        return
    }

    let channelId = args[1].replace(/\D/g, '')
    let targetChannel = client.channels.cache.get(channelId) as Discord.TextChannel

    if (!targetChannel || targetChannel.type !== 'text') {
        message.delete({ timeout: 10000 })
        let syntax = await message.channel.send(SyntaxEmbed)
        syntax.delete({ timeout: 15000 })
        return
    }

    let messageContent = args.slice(2).join(' ')

    targetChannel.send(messageContent)

    message.delete({ timeout: 10000 })

    return
}

export default new Command({
    configuration,
    executor
})

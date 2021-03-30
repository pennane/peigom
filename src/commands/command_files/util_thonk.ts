import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import Discord from 'discord.js'

const configuration: CommandConfiguration = {
    name: 'thonk',
    admin: false,
    syntax: 'thonk',
    desc: 'Lähettää kanavalle animoidun thonkin.',
    triggers: ['thonk'],
    type: ['utility', 'fun']
}

const executor: CommandExecutor = async (message, client, args) => {
    let hasEmoji = client.emojis.cache.some((emoji) => emoji.id === '443343009229045760')

    let hasPermission: boolean

    if (message.guild) {
        let channel = message.channel as Discord.TextChannel
        let permissions = message.guild.me ? channel.permissionsFor(message.guild.me) : null
        if (!permissions) {
            hasPermission = false
        } else {
            hasPermission = permissions.has('USE_EXTERNAL_EMOJIS')
        }
    } else {
        hasPermission = true
    }

    if (!hasEmoji || !hasPermission) {
        message.channel.send(':thinking:')
        return
    }

    message.channel.send('<a:thonk:443343009229045760>')
}

export default new Command({
    configuration,
    executor
})

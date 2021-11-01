import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import { getVoiceConnection } from '@discordjs/voice'

const configuration: CommandConfiguration = {
    name: 'hus',
    admin: false,
    syntax: 'hus',
    desc: 'Heittää botin pois äänikanavalta.',
    triggers: ['hus', 'hys'],
    type: ['utility']
}

const executor: CommandExecutor = async (message, client, args) => {
    if (!message.guildId) return
    const connection = getVoiceConnection(message.guildId)
    if (!connection) return
    connection.destroy()
}

export default new Command({
    configuration,
    executor
})

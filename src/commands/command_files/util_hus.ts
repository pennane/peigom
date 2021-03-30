import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
    name: 'hus',
    admin: false,
    syntax: 'hus',
    desc: 'Heittää botin pois äänikanavalta.',
    triggers: ['hus'],
    type: ['utility']
}

const executor: CommandExecutor = async (message, client, args) => {
    if (message.guild?.voice?.connection?.dispatcher) {
        message.guild.voice.connection.disconnect()
    }
    if (message.guild?.me?.voice.channel) {
        message.guild.me.voice.channel.leave()
    }
}

export default new Command({
    configuration,
    executor
})

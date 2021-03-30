import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
    name: 'ping',
    admin: true,
    syntax: 'ping',
    desc: 'pingaa bottia',
    triggers: ['ping', 'pong'],
    type: ['työkalut'],
    requireGuild: false
}

const executor: CommandExecutor = async (message, client, args) => {
    let embed = Command.createEmbed()
    embed.setTitle('Pong!').setDescription(Date.now() - message.createdTimestamp + 'ms')
    message.channel.send(embed)
}

export default new Command({
    configuration,
    executor
})

import Command, { CommandConfiguration, CommandExecutor } from '../Command'

const configuration: CommandConfiguration = {
    name: 'ping',
    admin: false,
    syntax: 'ping',
    desc: 'pingaa bottia',
    triggers: ['ping', 'pong'],
    type: ['utility'],
    requireGuild: false
}

const executor: CommandExecutor = async (message, client, args) => {
    const embed = Command.createEmbed()
    embed.setTitle('Pong!').setDescription(Date.now() - message.createdTimestamp + 'ms')
    message.channel.send({ embeds: [embed] })
}

export default new Command({
    configuration,
    executor
})

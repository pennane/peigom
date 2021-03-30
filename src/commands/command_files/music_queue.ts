import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
    name: 'queue',
    admin: false,
    syntax: 'queue',
    desc: 'näyttää jonossa olevat kipaleet',
    triggers: ['queue', 'q', 'keke', 'jono'],
    type: ['music'],
    requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
    let guild = message.guild
    if (!guild) return
    queueMethods.show({ guild: guild, message: message })
}

export default new Command({
    configuration,
    executor
})

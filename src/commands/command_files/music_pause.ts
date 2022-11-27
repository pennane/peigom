import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
    name: 'pause',
    admin: false,
    syntax: 'pause',
    desc: 'pysäyttää kipaleen',
    triggers: ['pause'],
    type: ['music'],
    requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
    const guild = message.guild
    if (!guild) return
    queueMethods.pause({ guild: guild })
}

export default new Command({
    configuration,
    executor
})

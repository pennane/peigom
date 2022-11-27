import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
    name: 'skip',
    admin: false,
    syntax: 'skip',
    desc: 'skippaa soivan kappaleen',
    triggers: ['skip', 's'],
    type: ['music'],
    requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
    const guild = message.guild
    if (!guild) return
    queueMethods.skip({ guild: guild, message: message })
}

export default new Command({
    configuration,
    executor
})

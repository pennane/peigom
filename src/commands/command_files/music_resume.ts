import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
    name: 'resume',
    admin: false,
    syntax: 'resume',
    desc: 'palauttaa kipaleen',
    triggers: ['resume'],
    type: ['music'],
    requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
    let guild = message.guild
    if (!guild) return
    queueMethods.resume({ guild: guild })
}

export default new Command({
    configuration,
    executor
})

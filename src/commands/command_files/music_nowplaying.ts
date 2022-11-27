import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
    name: 'np',
    admin: false,
    syntax: 'np',
    desc: 'näyttää tällä hetkellä soivan kipaleen',
    triggers: ['np', 'nowplaying'],
    type: ['music'],
    requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
    const guild = message.guild
    if (!guild) return
    queueMethods.nowPlaying({ guild: guild, message: message })
}

export default new Command({
    configuration,
    executor
})

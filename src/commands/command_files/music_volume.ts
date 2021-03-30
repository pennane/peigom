import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
    requireGuild: true,
    name: 'volume',
    admin: true,
    syntax: 'volume 1-infinity',
    desc: 'vaihtaa äänenpainetta',
    triggers: ['volume', 'vol'],
    type: ['music']
}

const executor: CommandExecutor = async (message, client, args) => {
    let guild = message.guild
    if (!guild) return
    queueMethods.volume({ guild: guild, message: message, volume: args[1] })
}

export default new Command({
    configuration,
    executor
})

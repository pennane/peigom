import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
    requireGuild: true,
    name: 'disconnect',
    admin: false,
    syntax: 'disconenct',
    desc: 'Lopettaa soittamisen ja lähtee böneen.',
    triggers: ['dc', 'disconnect'],
    type: ['music']
}

const executor: CommandExecutor = async (message, client, args) => {
    let guild = message.guild
    if (!guild) return
    queueMethods.disconnect({ guild: guild, message: message })
}

export default new Command({
    configuration,
    executor
})

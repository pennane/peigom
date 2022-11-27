import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
    requireGuild: true,
    name: 'move',
    admin: false,
    syntax: 'move',
    desc: 'Siirtää botin tälle lähettäjän äänikanavalle',
    triggers: ['move', 'siirrä', 'mv'],
    type: ['music']
}

const executor: CommandExecutor = async (message, client, args) => {
    const guild = message.guild
    if (!guild) return
    queueMethods.changeChannel({ guild: guild, message: message })
}

export default new Command({
    configuration,
    executor
})

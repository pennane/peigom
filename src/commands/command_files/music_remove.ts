import Command, { CommandConfiguration, CommandExecutor } from '../Command'

import { queueMethods } from '../../sound_handling/sound'

const configuration: CommandConfiguration = {
    name: 'remove',
    admin: false,
    syntax: 'remove <jonon numero>',
    desc: 'Poistaa kipaleen jonosta',
    triggers: ['remove', 'poista', 'rm'],
    type: ['music'],
    requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
    const guild = message.guild

    if (!guild) return

    const toRemove = Number(args[1])
    if (isNaN(toRemove)) return
    queueMethods.remove({ guild: guild, message: message, toRemove: toRemove })
}

export default new Command({
    configuration,
    executor
})

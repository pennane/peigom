import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
    name: 'tukom',
    admin: false,
    syntax: 'tukom',
    desc: 'tukom',
    triggers: ['tulikomentoja', 'tukom'],
    type: ['sound']
}

let soundfile = './assets/sound/tukom.wav'

const executor: CommandExecutor = async (message, client, args) => {
    playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
    configuration,
    executor
})

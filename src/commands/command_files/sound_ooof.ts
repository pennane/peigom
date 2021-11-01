import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
    name: 'ooof',
    admin: false,
    syntax: 'ooof',
    desc: 'elongated oof',
    triggers: ['ooof'],
    type: ['sound']
}

let soundfile = './assets/sound/ooof.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
    configuration,
    executor
})

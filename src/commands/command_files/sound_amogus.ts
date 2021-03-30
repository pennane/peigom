import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
    name: 'amogus',
    admin: false,
    syntax: 'amogus',
    desc: 'Soittaa amogus äänen',
    triggers: ['amogus'],
    type: ['sound']
}

let soundfile = './assets/sound/amogus.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    playSound({ soundfile, message })
}

export default new Command({
    configuration,
    executor
})

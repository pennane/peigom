import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
    name: 'kassakassa',
    admin: false,
    syntax: 'kassakassa',
    desc: 'Soittaa kassakassa äänen',
    triggers: ['kassakassa'],
    type: ['sound']
}

let soundfile = './assets/sound/kassakassa.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    playSound({ soundfile, message })
}

export default new Command({
    configuration,
    executor
})

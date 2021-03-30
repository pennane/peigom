import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
    name: 'kassa',
    admin: false,
    syntax: 'kassa',
    desc: 'Soittaa kassa äänen',
    triggers: ['kassa'],
    type: ['sound']
}

let soundfile = './assets/sound/kassa.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    playSound({ soundfile, message })
}

export default new Command({
    configuration,
    executor
})

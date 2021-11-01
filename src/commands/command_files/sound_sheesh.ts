import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
    name: 'bruh',
    admin: false,
    syntax: 'bruh',
    desc: 'bruh sound effect #2',
    triggers: ['bruh', 'bro'],
    type: ['sound']
}

let soundfile = './assets/sound/bruv.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
    configuration,
    executor
})

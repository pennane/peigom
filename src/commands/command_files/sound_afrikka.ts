import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
    name: 'afrikka',
    admin: false,
    syntax: 'afrikka',
    desc: 'tsiubidiubi',
    triggers: ['afrikka', 'africa'],
    type: ['sound']
}

const soundfile = './assets/sound/afrikka.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
    configuration,
    executor
})

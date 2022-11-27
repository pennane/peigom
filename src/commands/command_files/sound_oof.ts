import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
    name: 'oof',
    admin: false,
    syntax: 'oof',
    desc: 'Soittaa oof äänen',
    triggers: ['oof'],
    type: ['sound']
}

const soundfile = './assets/sound/oof.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
    configuration,
    executor
})

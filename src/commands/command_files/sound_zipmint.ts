import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
    name: 'zipmint',
    admin: false,
    syntax: 'zipmint',
    desc: 'Soittaa tsipmint äänen',
    triggers: ['zip', 'zipmint', 'tsipmint'],
    type: ['sound']
}
let soundfile = './assets/sound/zipmint.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
    configuration,
    executor
})

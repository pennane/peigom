import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
  name: 'of',
  admin: false,
  syntax: 'of',
  desc: 'Soittaa of äänen',
  triggers: ['of'],
  type: ['sound']
}

const soundfile = './assets/sound/of.mp3'

const executor: CommandExecutor = async (message, client, args) => {
  playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
  configuration,
  executor
})

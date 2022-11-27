import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
  name: 'vesi',
  admin: false,
  syntax: 'vesi',
  desc: 'nami nami',
  triggers: ['vesi', 'vettä'],
  type: ['sound']
}

const soundfile = './assets/sound/vesi.mp3'

const executor: CommandExecutor = async (message, client, args) => {
  playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
  configuration,
  executor
})

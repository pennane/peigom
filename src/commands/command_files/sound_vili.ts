import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
  name: 'vili',
  admin: false,
  syntax: 'vili',
  desc: 'Soittaa vili äänen',
  triggers: ['vili', 'wili', 'livi', 'willi', 'livi'],
  type: ['sound']
}

const soundfile = './assets/sound/vili.mp3'

const executor: CommandExecutor = async (message, client, args) => {
  playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
  configuration,
  executor
})

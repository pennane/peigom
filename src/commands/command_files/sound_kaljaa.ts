import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
  name: 'kaljaa',
  admin: false,
  syntax: 'kaljaa',
  desc: 'tsiubidiubi',
  triggers: ['kalja', 'kaljaa'],
  type: ['sound']
}

const soundfile = './assets/sound/kaljaa.mp3'

const executor: CommandExecutor = async (message, client, args) => {
  playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
  configuration,
  executor
})

import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'
import { randomFromArray } from '../../lib/util'

const configuration: CommandConfiguration = {
  name: 'dankmeme',
  admin: false,
  syntax: 'dankmeme',
  desc: 'Soittaa satunnaisen dank meme -äänen.',
  triggers: ['dankmeme'],
  type: ['sound']
}

const fileArray = [
  './assets/sound/meme.mp3',
  './assets/sound/meme2.mp3',
  './assets/sound/meme3.mp3'
]

const executor: CommandExecutor = async (message, client, args) => {
  const soundfile = `./assets/sound/${randomFromArray(fileArray)}`
  playSound({ soundfile, message, exitAfter: true })
}

export default new Command({
  configuration,
  executor
})

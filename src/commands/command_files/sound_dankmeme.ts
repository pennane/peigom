import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'
import { randomFromArray } from '../../util/misc'

const configuration: CommandConfiguration = {
    name: 'dankmeme',
    admin: false,
    syntax: 'dankmeme',
    desc: 'Soittaa satunnaisen dank meme -äänen.',
    triggers: ['dankmeme'],
    type: ['sound']
}

let fileArray = ['./assets/sound/meme.mp3', './assets/sound/meme2.mp3', './assets/sound/meme3.mp3']

const executor: CommandExecutor = async (message, client, args) => {
    let soundfile = `./assets/sound/${randomFromArray(fileArray)}`
    playSound({ soundfile, message })
}

export default new Command({
    configuration,
    executor
})

import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'
import { randomFromArray } from '../../util/misc'

const configuration: CommandConfiguration = {
    name: 'imgonnasaythenword',
    admin: false,
    syntax: 'imgonnasaythenword',
    desc: 'thats racist, you cannot say the nword',
    triggers: ['imgonnasaythenword', 'nword'],
    type: ['sound']
}

let fileArray = ['nword.mp3', 'nword2.mp3']

const executor: CommandExecutor = async (message, client, args) => {
    let soundfile = `./assets/sound/${randomFromArray(fileArray)}`
    playSound({ soundfile, message })
}

export default new Command({
    configuration,
    executor
})

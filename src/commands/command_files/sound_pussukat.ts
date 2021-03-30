import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'
import fs from 'fs'
import { randomFromArray } from '../../util/misc'

const configuration: CommandConfiguration = {
    name: 'pussukat',
    admin: false,
    syntax: 'pussukat',
    desc: 'Soittaa satunnaisen kappaleen botin pussukat kansiosta',
    triggers: ['pussukat', 'pussukka'],
    type: ['sound']
}

let fileArray: string[] = fs
    .readdirSync('./assets/sound/pussukat')
    .filter((file) => file.endsWith('.mp3') || file.endsWith('.wav'))

const executor: CommandExecutor = async (message, client, args) => {
    let soundfile = `./assets/sound/pussukat/${randomFromArray(fileArray)}`
    playSound({ soundfile, message })
}

export default new Command({
    configuration,
    executor
})

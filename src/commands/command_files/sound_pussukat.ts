import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'
import fs from 'fs'
import { randomFromArray } from '../../lib/util'

const configuration: CommandConfiguration = {
    name: 'pussukat',
    admin: false,
    syntax: 'pussukat (-i)',
    desc: 'Soittaa satunnaisen kappaleen botin pussukat kansiosta',
    triggers: ['pussukat', 'pussukka'],
    type: ['sound']
}

let fileArray: string[] = fs
    .readdirSync('./assets/sound/pussukat')
    .filter((file) => file.endsWith('.mp3') || file.endsWith('.wav'))

const getSoundFile = () => {
    return `./assets/sound/pussukat/${randomFromArray(fileArray)}`
}

const executor: CommandExecutor = async (message, client, args) => {
    const infinite = args[1] === '-i' || args[1] === '--infinite'

    if (!infinite) {
        const soundfile = getSoundFile()
        playSound({ soundfile, message, exitAfter: true })
        return
    }

    const playInfinitely = async () => {
        const soundfile = getSoundFile()
        try {
            await playSound({ soundfile, message, exitAfter: false })
        } catch {
            return
        }
        playInfinitely()
    }

    playInfinitely()
}

export default new Command({
    configuration,
    executor
})

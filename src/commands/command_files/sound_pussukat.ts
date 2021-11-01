import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'
import fs from 'fs'
import { randomFromArray } from '../../lib/util'

const configuration: CommandConfiguration = {
    name: 'pussukat',
    admin: false,
    syntax: 'pussukat (-i | --infinite)',
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
    const voiceChannel = message.member?.voice.channel
    const infinite = args[1] === '-i' || args[1] === '--infinite'

    if (!infinite) {
        const soundfile = getSoundFile()
        playSound({ soundfile, message, exitAfter: true })
        return
    }

    let plays = 0

    const handleEnd = () => {
        console.log('End of pussukat')
        if (plays > 1) {
            message.channel.send('Sheeesh, soitin just ' + plays + ' yhtenäistä pussukkaa')
        }
    }

    const playInfinitely = async () => {
        const soundfile = getSoundFile()
        const channel = await voiceChannel?.fetch()

        const shouldLeave = !channel?.isVoice() || channel.members.size <= 1

        if (plays > 0 && shouldLeave) {
            handleEnd()
            return
        }

        plays++

        try {
            await playSound({ soundfile, message, exitAfter: false })
        } catch {
            handleEnd()

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

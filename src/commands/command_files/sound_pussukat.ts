import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'
import fs from 'fs'
import { arrayToChunks, randomFromArray } from '../../lib/util'

const configuration: CommandConfiguration = {
    name: 'pussukat',
    admin: false,
    syntax: 'pussukat < -i | --infinite > | < -l | --list > | < filename >',
    desc: 'Soittaa kappaleen botin pussukkakansiosta',
    triggers: ['pussukat', 'pussukka'],
    type: ['sound']
}

const fileArray: string[] = fs
    .readdirSync('./assets/sound/pussukat')
    .filter((file) => file.endsWith('.mp3') || file.endsWith('.wav'))

const embedFileArray: string[] = fileArray.map((f) => '`'.concat(f).concat('`'))

const soundRoot = './assets/sound/pussukat/'

const getSoundFileName = () => {
    return randomFromArray(fileArray)
}

const fileChunks = arrayToChunks(embedFileArray, 18)
const pageCount = fileChunks.length

const executor: CommandExecutor = async (message, client, args) => {
    const embed = Command.createEmbed()
    embed.setTitle('Pussukka')

    if (args[1] === '-l' || args[1] === '--list') {
        let pageNumber = parseInt(args[2]) - 1 || 0

        if (pageNumber < 0) pageNumber = 0
        else if (pageNumber > pageCount - 1) pageNumber -= 1

        embed.setFooter(`Sivu ${pageNumber + 1} / ${pageCount}`)
        embed.addField(`Sivun ${pageNumber + 1} pussukat`, fileChunks[pageNumber].join(' '))

        message.channel.send({ embeds: [embed] })
        return
    }

    const voiceChannel = message.member?.voice.channel
    const isInfinite = args[1] === '-i' || args[1] === '--infinite'
    const isSpecificTrack =
        !isInfinite &&
        args[1] &&
        !args[1].startsWith('.') &&
        fileArray.some((f) => f.toLowerCase().endsWith(args[1].toLowerCase()))

    if (!isInfinite && !isSpecificTrack) {
        const fileName = getSoundFileName()
        const soundfile = soundRoot + fileName

        embed.setDescription(fileName)
        message.channel.send({ embeds: [embed] })

        playSound({ soundfile, message, exitAfter: true })
        return
    } else if (!isInfinite && isSpecificTrack) {
        const fileName = args[1]
        const soundfile = soundRoot + fileName

        embed.setDescription(fileName)
        message.channel.send({ embeds: [embed] })
        playSound({ soundfile, message, exitAfter: true })
        return
    }

    let plays = 0

    const handleEnd = () => {
        if (plays > 1) {
            message.channel.send('Sheeesh, soitin just ' + plays + ' yhtenäistä pussukkaa')
        }
    }

    const playInfinitely = async () => {
        const fileName = getSoundFileName()
        const soundfile = soundRoot + fileName

        const channel = await voiceChannel?.fetch()

        const shouldLeave = !channel || !channel?.isVoice() || channel.members.size <= 1

        if (plays > 0 && shouldLeave) {
            handleEnd()
            return
        }

        plays++

        try {
            embed.setDescription(fileName)
            message.channel.send({ embeds: [embed] })
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

import playSound from '../../sound_handling/playSound'
import dancemoves from '../../../assets/misc/fortnite/dancemoves'
import Command, { CommandExecutor } from '../Command'
import { queueMethods } from '../../sound_handling/sound'

const configuration = {
    name: 'fortnite',
    admin: false,
    syntax: 'fortnite',
    desc: 'tanssi eeppisiä fornite liikkeitä',
    triggers: ['fortnite', 'fortnight', 'fornite'],
    type: ['fun', 'sound']
}

let soundfile = './assets/sound/fortnite.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    if (!message.member || !message.guild) return

    let voiceChannel = message.member?.voice.channel

    let user = message.member.user

    if (!voiceChannel) {
        let embed = Command.createEmbed()
        embed.setTitle(`Botin kommentti:`).setDescription(`${user.username} mene eka jollekki voicechannelille, kid.`)
        message.channel.send(embed)
        return
    }

    if (queueMethods.isPlaying({ guild: message.guild })) {
        let embed = Command.createEmbed()
        embed.setTitle(`Botin kommentti:`).setDescription(`${user.username} sul on jo musat tulilla, kid.`)
        message.channel.send(embed)
        return
    }

    voiceChannel.join().then(async (connection) => {
        playSound({ soundfile, message })
        dancemoves.forEach((move, i) => {
            setTimeout(() => {
                message.channel.send(move)
            }, (7000 * i) / dancemoves.length + 500)
        })
    })
}

export default new Command({
    configuration,
    executor
})

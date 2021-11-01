import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'
import { getVoiceConnection } from '@discordjs/voice'

const configuration: CommandConfiguration = {
    name: 'yike',
    admin: false,
    syntax: 'yike <@user>',
    desc: 'award yikes',
    triggers: ['yike', 'yikes', '+yike'],
    type: ['fun', 'sound']
}

let soundfile = './assets/misc/yike/yike.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    if (!message.guild) return

    let targetUser = args[1] ? message.guild.members.cache.get(args[1].replace(/\D/g, '')) : false
    if (!targetUser) {
        let embed = Command.createEmbed()
        embed
            .setTitle(`Botin kommentti:`)
            .setDescription(`${message.author.username} ei tollasille voi antaa yikejä. (yike \<@user>)`)
        message.channel.send({ embeds: [embed] })
        return
    }

    let voiceChannel = targetUser.voice.channel

    let botVoiceConnection = getVoiceConnection(message.guild.id)

    if (!voiceChannel || botVoiceConnection) {
        message.channel.send({
            content: targetUser.toString(),
            files: [
                {
                    attachment: './assets/misc/yike/yike.jpg',
                    name: 'yike.jpg'
                }
            ]
        })
        return
    }

    playSound({ soundfile, message, exitAfter: true })
    message.channel.send({
        content: targetUser.toString(),
        files: [
            {
                attachment: './assets/misc/yike/yike.jpg',
                name: 'yike.jpg'
            }
        ]
    })
}

export default new Command({
    configuration,
    executor
})

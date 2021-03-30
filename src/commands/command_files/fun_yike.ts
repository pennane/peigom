import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

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
        message.channel.send(embed)
        return
    }

    let voiceChannel = targetUser.voice.channel

    if (!voiceChannel || message.guild?.voice?.connection) {
        message.channel.send(targetUser, {
            files: [
                {
                    attachment: './assets/misc/yike/yike.jpg',
                    name: 'yike.jpg'
                }
            ]
        })
        return
    }

    playSound({ soundfile, message })
    message.channel.send(targetUser, {
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

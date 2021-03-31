import Discord from 'discord.js'
import activityLogger from '../util/activityLogger'
import { queueMethods } from './sound'
import Command from '../commands/Command'

const play = async function ({ soundfile, message }: { soundfile: string; message: Discord.Message }) {
    try {
        if (!message.member || !message.guild) return

        let voiceChannel = message.member?.voice.channel

        let user = message.member.user

        if (!voiceChannel) {
            let embed = Command.createEmbed()
            embed
                .setTitle(`Botin kommentti:`)
                .setDescription(`${user.username} mene eka jollekki voicechannelille, kid.`)
            message.channel.send(embed)
            return
        }

        if (queueMethods.isPlaying({ guild: message.guild })) {
            let embed = Command.createEmbed()
            embed.setTitle(`Botin kommentti:`).setDescription(`${user.username} sul on jo musat tulilla, kid.`)
            message.channel.send(embed)
            return
        }

        let connection = await voiceChannel.join()

        const dispatcher = connection.play(soundfile)

        dispatcher.on('finish', () => {
            if (message.guild?.me?.voice.channel) {
                message.guild.me.voice.channel.leave()
            }
        })

        dispatcher.on('error', (error) => {
            throw error
        })
    } catch (error) {
        activityLogger.log({ id: 32, content: 'Error in playsound', error })
    } finally {
        return
    }
}

export default play

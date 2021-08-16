import Discord from 'discord.js'
import activityLogger from '../lib/activityLogger'
import { queueMethods } from './sound'
import Command from '../commands/Command'
import {
    generateDependencyReport,
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus
} from '@discordjs/voice'

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
            message.channel.send({ embeds: [embed] })
            return
        }

        if (voiceChannel.type === 'GUILD_STAGE_VOICE') {
            let embed = Command.createEmbed()
            embed.setTitle(`Botin kommentti:`).setDescription(`Botti ei osaa liittyä stage channeleille, sori.`)
            message.channel.send({ embeds: [embed] })
            return
        }

        if (queueMethods.isPlaying({ guild: message.guild })) {
            let embed = Command.createEmbed()
            embed.setTitle(`Botin kommentti:`).setDescription(`${user.username} sul on jo musat tulilla, kid.`)
            message.channel.send({ embeds: [embed] })
            return
        }

        let connection = joinVoiceChannel({
            guildId: voiceChannel.guild.id,
            channelId: voiceChannel.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        })

        const player = createAudioPlayer()
        const resource = createAudioResource(soundfile)

        player.play(resource)

        connection.subscribe(player)

        player.on('error', (error) => {
            throw error
        })

        player.on(AudioPlayerStatus.Idle, () => {
            if (connection) {
                connection.destroy()
            }
        })
    } catch (error) {
        activityLogger.log({ id: 32, content: 'Error in playsound', error })
    } finally {
        return
    }
}

export default play

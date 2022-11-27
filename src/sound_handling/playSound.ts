import Discord from 'discord.js'
import { queueMethods } from './sound'
import Command from '../commands/Command'
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} from '@discordjs/voice'

const play = async ({
  soundfile,
  message,
  exitAfter
}: {
  soundfile: string
  message: Discord.Message
  exitAfter: boolean
}) => {
  if (!message.member || !message.guild) return

  const voiceChannel = message.member?.voice.channel

  const user = message.member.user

  if (!voiceChannel || !voiceChannel.isVoice()) {
    const embed = Command.createEmbed()
    embed
      .setTitle(`Botin kommentti:`)
      .setDescription(
        `${user.username} mene eka jollekki voicechannelille, kid.`
      )
    message.channel.send({ embeds: [embed] })
    return
  }

  if (voiceChannel.type === 'GUILD_STAGE_VOICE') {
    const embed = Command.createEmbed()
    embed
      .setTitle(`Botin kommentti:`)
      .setDescription(`Botti ei osaa liittyä stage channeleille, sori.`)
    message.channel.send({ embeds: [embed] })
    return
  }

  if (queueMethods.isPlaying({ guild: message.guild })) {
    const embed = Command.createEmbed()
    embed
      .setTitle(`Botin kommentti:`)
      .setDescription(`${user.username} sul on jo musat tulilla, kid.`)
    message.channel.send({ embeds: [embed] })
    return
  }

  const connection = joinVoiceChannel({
    guildId: voiceChannel.guild.id,
    channelId: voiceChannel.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
  })

  const player = createAudioPlayer()

  const resource = createAudioResource(soundfile)
  connection.subscribe(player)
  player.on(AudioPlayerStatus.Idle, () => {
    if (connection && exitAfter) {
      connection.destroy()
    }
  })

  player.play(resource)
}

export default play

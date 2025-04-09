import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus
} from '@discordjs/voice'
import { ChannelType, Message, VoiceBasedChannel } from 'discord.js'
import Command from '../commands/Command'

const play = ({
  soundfile,
  message,
  exitAfter
}: {
  soundfile: string
  message: Message
  exitAfter: boolean
}): Promise<void> =>
  new Promise(async (resolve, reject) => {
    const channel = message.channel

    const member = message.member
    const guild = message.guild

    if (!member || !guild || channel.type !== ChannelType.GuildText)
      return reject()

    const voiceChannel = member.voice.channel as VoiceBasedChannel | null
    const user = member.user

    if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
      const embed = Command.createEmbed()
        .setTitle(`Botin kommentti:`)
        .setDescription(
          `${user.username} mene eka jollekki voicechannelille, kid.`
        )

      await channel.send({ embeds: [embed] })
      return reject()
    }

    try {
      const connection = joinVoiceChannel({
        guildId: voiceChannel.guild.id,
        channelId: voiceChannel.id,
        adapterCreator: voiceChannel.guild
          .voiceAdapterCreator as DiscordGatewayAdapterCreator // Cast the type here
      })

      await entersState(connection, VoiceConnectionStatus.Ready, 5_000)

      const player = createAudioPlayer()
      const resource = createAudioResource(soundfile)

      connection.subscribe(player)

      player.on(AudioPlayerStatus.Idle, () => {
        if (exitAfter) {
          connection.destroy()
        }
        resolve()
      })

      player.on('error', (err) => {
        console.error('Audio player error:', err)
        if (exitAfter) connection.destroy()
        reject(err)
      })

      player.play(resource)
    } catch (err) {
      console.error('Voice connection error:', err)
      const embed = Command.createEmbed()
        .setTitle(`Virhe`)
        .setDescription(`Jotain meni pieleen ääntä soitettaessa.`)

      await channel.send({ embeds: [embed] })
      reject(err)
    }
  })

export default play

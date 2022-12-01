import { YOUTUBE_API_KEY } from '../lib/config'
import Discord, { Util, Snowflake } from 'discord.js'
import { AudioPlayerStatus } from '@discordjs/voice'
import { videoInfo } from 'ytdl-core'
import { msToReadable, ServerQueue, shuffleArray } from '../lib/util'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Youtube = require('simple-youtube-api')

export const yt = new Youtube(YOUTUBE_API_KEY)

const QueueMap: Map<Snowflake, ServerQueue> = new Map()

export interface Track extends videoInfo {
  requestedBy?: Discord.GuildMember
  toTop?: boolean
}
interface AddArguments {
  guild: Discord.Guild
  message: Discord.Message
  voiceChannel: Discord.VoiceBasedChannel
  track: Track
}

export const queueMethods = {
  add: async function ({ guild, message, voiceChannel, track }: AddArguments) {
    if (!track) {
      return
    }

    if (!QueueMap.has(guild.id)) {
      QueueMap.set(
        guild.id,
        new ServerQueue({ guild, voiceChannel, map: QueueMap })
      )
    }

    const serverQueue = QueueMap.get(guild.id) as ServerQueue

    const trackDuration = msToReadable(
      Number(track.videoDetails.lengthSeconds) * 1000
    )

    const responseEmbed = new Discord.MessageEmbed()
      .addField(
        `Jonoon lisätty`,
        `[${track.videoDetails.title}](${track.videoDetails.video_url})`
      )
      .setColor('#2f3136')
      .addField('Pituus', trackDuration, true)
      .addField('Biisiä toivo:', track.requestedBy?.toString() || '?', true)
      .setURL(track.videoDetails.video_url)

    if (track.videoDetails.thumbnails[0].url) {
      responseEmbed.setThumbnail(track.videoDetails.thumbnails[0].url)
    }

    message.channel.send({ embeds: [responseEmbed] })

    if (!serverQueue.getIsPlaying()) {
      serverQueue.addTrack(track)
      serverQueue.playNextResource({
        shift: false,
        forceNewConnection: true,
        voiceChannel: message.member?.voice.channel || undefined
      })
      return
    }

    if (track.toTop) {
      serverQueue.addTrackToTop(track)
      return
    }

    serverQueue.addTrack(track)
  },
  show: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue || serverQueue.tracks.length === 0) {
      return message.channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
    }
    const trackLength = msToReadable(
      Number(serverQueue.tracks[0].videoDetails.lengthSeconds) * 1000
    )
    const playedLength = msToReadable(
      serverQueue.resource?.playbackDuration || 0
    )

    const responseEmbed = new Discord.MessageEmbed()
      .setColor('#2f3136')
      .addField(
        `Nyt soi:`,
        `[${serverQueue.tracks[0].videoDetails.title}](${serverQueue.tracks[0].videoDetails.video_url})\n${playedLength} / ${trackLength}`,
        true
      )
      .addField(
        'Biisiä toivo:',
        serverQueue.tracks[0].requestedBy?.toString() || '?',
        true
      )
      .setURL(serverQueue.tracks[0].videoDetails.video_url)

    if (serverQueue?.tracks[0]?.videoDetails?.thumbnails[0]?.url) {
      responseEmbed.setThumbnail(
        serverQueue.tracks[0].videoDetails.thumbnails[0].url
      )
    }

    if (!serverQueue.tracks[1]) {
      message.channel.send({ embeds: [responseEmbed] })
      return
    }

    const tracks = serverQueue.tracks
      .slice(1)
      .map(
        (track, i) =>
          `\`${i + 1}\`: [${track.videoDetails.title}](${
            track.videoDetails.video_url
          })`
      )
    const tracksMessage = tracks.join('\n')
    const parts = Util.splitMessage(tracksMessage, { maxLength: 950 })
    const first = parts[0]
    const rest = parts.slice(1, 2)

    responseEmbed.addField('Seuraavana', first)

    if (!rest) {
      message.channel.send({ embeds: [responseEmbed] })
      return
    }

    for (const part of rest) {
      responseEmbed.addField('\u200b', part)
    }

    message.channel.send({ embeds: [responseEmbed] })

    return
  },
  nowPlaying: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue || serverQueue.tracks.length === 0) {
      message.channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
      return
    }

    const responseEmbed = new Discord.MessageEmbed()
    const track = serverQueue.tracks[0]
    const trackLength = msToReadable(
      Number(serverQueue.tracks[0].videoDetails.lengthSeconds) * 1000
    )
    const playedLength = msToReadable(
      serverQueue.resource?.playbackDuration || 0
    )

    responseEmbed
      .addField(
        `Nyt soi:`,
        `[${serverQueue.tracks[0].videoDetails.title}](${serverQueue.tracks[0].videoDetails.video_url})\n${playedLength} / ${trackLength}`,
        true
      )
      .setColor('#2f3136')
      .addField('Biisiä toivo:', track.requestedBy?.toString() || '?', true)

    if (track?.videoDetails?.thumbnails[0]?.url) {
      responseEmbed.setThumbnail(track.videoDetails.thumbnails[0].url)
    }

    message.channel.send({ embeds: [responseEmbed] })
    return
  },
  skip: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const serverQueue = QueueMap.get(guild.id)
    if (!serverQueue?.getIsPlaying()) {
      message.channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
      return
    }

    message.channel.send(
      `:track_next: skipataan ${serverQueue.tracks[0].videoDetails.title}`
    )

    serverQueue.playNextResource({ shift: true })
  },
  disconnect: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue?.getIsConnected())
      return message.channel.send(':x: En edes ollut kiusaamassa.')

    serverQueue.disconnect()
    QueueMap.delete(guild.id)
    return message.channel.send(':wave: Ilosesti böneen!')
  },
  clear: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue || serverQueue.tracks.length <= 1) {
      message.channel.send(':x: Ei ollut mitään mitä puhdistaa, >:^U')
      return
    }

    serverQueue.clearQueue()
    message.channel.send(':wastebasket:  Musiikkijono tyhjennetty!')
  },
  shuffle: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue || serverQueue.tracks.length < 3) {
      message.channel.send(':hand_splayed: Bro, ei pyge sekottaa')
      return
    }

    serverQueue.tracks = [
      serverQueue.tracks[0],
      ...shuffleArray(serverQueue.tracks.slice(1))
    ]
    message.channel.send(':ok_hand: Sekotettu niinku tehosekoti')
  },
  remove: function ({
    guild,
    message,
    toRemove
  }: {
    guild: Discord.Guild
    message: Discord.Message
    toRemove: number
  }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue) {
      return message.channel.send(
        ':hand_splayed: Bro, ei voi poistaa. Duunasikko oikein?'
      )
    }

    if (toRemove < 1) {
      return message.channel.send(
        ':hand_splayed: Bro, ei voi poistaa ekaa biisii. Koita vaik skippaa?'
      )
    } else if (toRemove > serverQueue.tracks.length) {
      return message.channel.send(
        ':hand_splayed: Bro, ei voi poistaa biisiä mitä ei oo.'
      )
    }

    const track = [...serverQueue.tracks][toRemove]
    if (!track) {
      return message.channel.send(':hand_splayed: Bro, ultra mankeli')
    }
    serverQueue.tracks = serverQueue.tracks.filter(
      (_track, i) => i !== toRemove
    )
    message.channel.send(
      `:ok: Kappale \`${track.videoDetails.title}\` on poistettu jonosta.`
    )
    return
  },
  pause: function ({ guild }: { guild: Discord.Guild }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue) return
    if (serverQueue.getPlayer().state.status === AudioPlayerStatus.Paused) {
      return
    }

    serverQueue.getPlayer().pause()
  },
  resume: function ({ guild }: { guild: Discord.Guild }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue) return

    if (serverQueue.getPlayer().state.status === AudioPlayerStatus.Paused) {
      serverQueue.getPlayer().unpause()
    }
  },
  volume: function ({
    guild,
    message,
    volume
  }: {
    guild: Discord.Guild
    message: Discord.Message
    volume: string
  }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue) return

    if (!volume) {
      message.channel.send(
        'Tän hetkinen volyymi on ' + serverQueue.options.volume
      )
      return
    }

    const computedVolume = parseFloat(volume.replace(',', '.'))

    if (computedVolume < 0) {
      message.channel.send(
        'Tän hetkinen volyymi on ' +
          serverQueue.options.volume +
          '. Nollan alle se ei mene.'
      )
      return
    }

    serverQueue.options.volume = computedVolume

    serverQueue.resource?.volume?.setVolume(computedVolume)

    message.channel.send('Volyymiks asetettu ' + computedVolume)
    return
  },
  isPlaying: function ({ guild }: { guild: Discord.Guild }) {
    if (!guild) {
      return false
    }

    const serverQueue = QueueMap.get(guild.id)

    return serverQueue?.getIsPlaying()
  },
  readOnlyQueue: function ({ guild }: { guild: Discord.Guild }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue) return

    return serverQueue
  },
  changeChannel: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const serverQueue = QueueMap.get(guild.id)
    const newChannel = message.member?.voice.channel

    if (!serverQueue || !newChannel) return

    if (serverQueue.voiceChannel.id === newChannel.id) return

    if (newChannel.type === 'GUILD_STAGE_VOICE') return
    serverQueue.updateVoicechannel(newChannel)

    return
  }
}

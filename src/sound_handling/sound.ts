import { YOUTUBE_API_KEY } from '../lib/config'
import Discord, { Util, Snowflake } from 'discord.js'
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  VoiceConnection,
  AudioPlayer,
  AudioResource
} from '@discordjs/voice'
import ytdl, { videoInfo } from 'ytdl-core'
import {
  buildInitialServerQueue,
  msToReadable,
  shuffleArray
} from '../lib/util'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Youtube = require('simple-youtube-api')

export const yt = new Youtube(YOUTUBE_API_KEY)

const QueueMap: Map<Snowflake, ServerQueue> = new Map()

export interface Track extends videoInfo {
  requestedBy?: Discord.GuildMember
  toTop?: boolean
}

export interface ServerQueue {
  voiceChannel: Discord.VoiceChannel
  guild: Discord.Guild
  connection: VoiceConnection | null
  player: AudioPlayer | null
  resource: AudioResource<null> | null
  tracks: Track[]
  options: {
    volume: number
  }
}

interface AddArguments {
  guild: Discord.Guild
  message: Discord.Message
  voiceChannel: Discord.VoiceChannel
  track: Track
}

const shiftToNextResource = (guild: Discord.Guild): AudioResource | null => {
  const serverQueue = QueueMap.get(guild.id)
  if (!serverQueue) return null

  serverQueue.tracks = serverQueue.tracks.slice(1)

  const track = serverQueue.tracks[0]
  if (!track) return null

  const stream = ytdl(track.videoDetails.video_url, {
    filter: 'audioonly',
    quality: 'lowest'
  })
  const resource = createAudioResource(stream, { inlineVolume: true })
  resource.volume?.setVolume(serverQueue.options.volume)
  serverQueue.resource = resource

  return resource
}

const dispatchGuild = async (guild: Discord.Guild): Promise<void> => {
  const serverQueue = QueueMap.get(guild.id)
  if (!serverQueue) return

  serverQueue.options.volume = 1

  const connection = joinVoiceChannel({
    guildId: serverQueue.voiceChannel.guild.id,
    channelId: serverQueue.voiceChannel.id,
    adapterCreator: serverQueue.voiceChannel.guild.voiceAdapterCreator
  })

  serverQueue.connection = connection

  connection.on(VoiceConnectionStatus.Destroyed, () => {
    QueueMap.delete(guild.id)
  })

  const track = serverQueue.tracks[0]

  if (!track) {
    if (serverQueue.player) {
      serverQueue.player.stop()
      serverQueue.player = null
    }
    serverQueue.connection?.destroy()
    QueueMap.delete(guild.id)
    return
  }

  const stream = ytdl(track.videoDetails.video_url, {
    filter: 'audioonly',
    quality: 'lowest'
  })
  const player = createAudioPlayer()
  const resource = createAudioResource(stream, { inlineVolume: true })
  resource.volume?.setVolume(serverQueue.options.volume)

  serverQueue.resource = resource
  serverQueue.player = player
  serverQueue.player.play(resource)
  serverQueue.connection.subscribe(player)

  serverQueue.player.on(AudioPlayerStatus.Idle, () => {
    const nextResource = shiftToNextResource(guild)
    if (!nextResource) {
      const serverQueue = QueueMap.get(guild.id)
      if (!serverQueue) return
      serverQueue.player?.stop()
      serverQueue.player = null
      return
    }

    player.play(nextResource)
  })
}

export const queueMethods = {
  add: async function ({ guild, message, voiceChannel, track }: AddArguments) {
    if (!track) return

    if (!QueueMap.has(guild.id)) {
      QueueMap.set(guild.id, buildInitialServerQueue({ guild, voiceChannel }))
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

    if (!serverQueue.connection || !serverQueue.player) {
      serverQueue.tracks = serverQueue.tracks.concat(track)
      dispatchGuild(guild)
      return
    }

    if (track.toTop) {
      serverQueue.tracks = [
        serverQueue.tracks[0],
        track,
        ...serverQueue.tracks.slice(1)
      ]
      return
    }

    serverQueue.tracks.push(track)
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
    if (
      !serverQueue ||
      !serverQueue.player ||
      serverQueue.tracks.length === 0
    ) {
      message.channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
      return
    }

    message.channel.send(
      `:track_next: ${serverQueue.tracks[0].videoDetails.title} skipattu!`
    )

    if (serverQueue.tracks.length <= 1) {
      serverQueue?.player?.stop()
      serverQueue.connection?.destroy()
      QueueMap.delete(guild.id)
      return
    }

    const resource = shiftToNextResource(guild)

    if (!resource) {
      serverQueue?.player?.stop()
      serverQueue.connection?.destroy()
      QueueMap.delete(guild.id)
      return
    }

    serverQueue.player.play(resource)

    return
  },
  disconnect: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue || !serverQueue.connection)
      return message.channel.send(':x: En edes ollut kiusaamassa.')

    serverQueue.connection?.destroy()
    serverQueue.player?.stop()
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

    serverQueue.tracks = [serverQueue.tracks[0]]
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
    if (!serverQueue?.player) return
    if (serverQueue.player.state.status === AudioPlayerStatus.Paused) {
      return
    }

    serverQueue.player.pause()
  },
  resume: function ({ guild }: { guild: Discord.Guild }) {
    const serverQueue = QueueMap.get(guild.id)

    if (!serverQueue) return
    if (!serverQueue?.player) return

    if (serverQueue.player.state.status === AudioPlayerStatus.Paused) {
      serverQueue.player.unpause()
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

    if (!serverQueue) {
      return false
    }

    if (serverQueue.tracks.length === 0 || !serverQueue.connection) {
      return false
    }

    return true
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

    if (!serverQueue?.player) return

    const newConnection = joinVoiceChannel({
      guildId: newChannel.guild.id,
      channelId: newChannel.id,
      adapterCreator: serverQueue.voiceChannel.guild.voiceAdapterCreator
    })

    newConnection.subscribe(serverQueue.player)
    serverQueue.connection = newConnection
    serverQueue.voiceChannel = newChannel

    return
  }
}

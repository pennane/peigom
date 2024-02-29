import { YOUTUBE_API_KEY } from '../lib/config'
import Discord, { Snowflake, Util } from 'discord.js'
import ytdl, { videoInfo } from 'ytdl-core'
import { msToReadable } from '../lib/util'
import {
  AudioPlayerStatus,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel
} from '@discordjs/voice'
import internal from 'stream'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Youtube = require('simple-youtube-api')

export const yt = new Youtube(YOUTUBE_API_KEY)

type ServerQueue = {
  id: Snowflake
  tracks: Track[]
  voiceChannel: Discord.VoiceBasedChannel
  nowPlaying: Track | null
  stream: internal.Readable | null
}

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

const disconnect = (guildId: Snowflake) => {
  getVoiceConnection(guildId)?.destroy()

  const queue = QueueMap.get(guildId)
  if (!queue) return
  queue.tracks = []
  queue.stream?.destroy()
  QueueMap.delete(guildId)
}

const connect = async (guildId: Snowflake) => {
  const queue = QueueMap.get(guildId)
  if (!queue) {
    return
  }
  const voiceChannel = queue.voiceChannel
  if (!voiceChannel) {
    return
  }

  const existingConnection = getVoiceConnection(guildId)
  if (existingConnection) return existingConnection
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator as any
  })

  if (connection.state.status !== VoiceConnectionStatus.Ready) {
    await new Promise((resolve) =>
      connection.addListener(VoiceConnectionStatus.Ready, resolve)
    )
  }

  connection.on(VoiceConnectionStatus.Destroyed, () => disconnect(guildId))

  return connection
}

const startNext = (guildId: Snowflake) => {
  const queue = QueueMap.get(guildId)
  if (!queue) return
  const track = queue.tracks.shift()
  if (!track) {
    disconnect(guildId)
    return
  }
  play(guildId, track)
}
const play = async (guildId: Snowflake, track: Track) => {
  const queue = QueueMap.get(guildId)
  if (!queue) return

  queue.nowPlaying = track

  const stream = ytdl(track.videoDetails.video_url, {
    filter: 'audioonly',
    quality: 'lowest',
    requestOptions: {
      maxReconnects: 50,
      maxRetries: 20
    }
  })

  const resource = createAudioResource(stream)
  const connection = await connect(guildId)

  if (!connection) {
    queue.nowPlaying = null
    queue.stream = null
    return
  }

  queue.stream = stream

  const player = createAudioPlayer()

  connection.subscribe(player)
  player.play(resource)

  try {
    await entersState(player, AudioPlayerStatus.Playing, 10000)
  } catch (error) {
    queue.nowPlaying = null
    queue.stream = null
    return startNext(guildId)
  }

  queue.nowPlaying = track

  try {
    await entersState(
      player,
      AudioPlayerStatus.Idle,
      Number(track.videoDetails.lengthSeconds) * 1000 + 2000
    )
  } catch (e) {
    //
  } finally {
    queue.nowPlaying = null
    queue.stream = null
    startNext(guildId)
  }
}

export const queueMethods = {
  add: async function ({ guild, message, voiceChannel, track }: AddArguments) {
    if (!track) {
      return
    }

    if (!QueueMap.has(guild.id)) {
      QueueMap.set(guild.id, {
        id: guild.id,
        tracks: [],
        voiceChannel,
        nowPlaying: null,
        stream: null
      })
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

    serverQueue.tracks.push(track)
    if (serverQueue.nowPlaying === null) {
      startNext(guild.id)
    }
  },
  skip: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const serverQueue = QueueMap.get(guild.id)
    if (!serverQueue) {
      message.channel.send(':hand_splayed: Bro, no keke')
      return
    }
    if (!serverQueue.nowPlaying) {
      message.channel.send(':hand_splayed: Bro, tyhjä keke ? impossible')
      return
    }

    message.channel.send(
      `:track_next: skipataan ${serverQueue.nowPlaying.videoDetails.title}`
    )

    serverQueue.stream?.destroy()
    serverQueue.stream = null
    startNext(guild.id)
  },
  show: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const serverQueue = QueueMap.get(guild.id)

    if (
      !serverQueue ||
      !serverQueue.nowPlaying ||
      !getVoiceConnection(guild.id)
    ) {
      return message.channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
    }
    const trackLength = msToReadable(
      Number(serverQueue.nowPlaying.videoDetails.lengthSeconds) * 1000
    )

    const track = serverQueue.nowPlaying

    const responseEmbed = new Discord.MessageEmbed()
      .setColor('#2f3136')
      .addField(
        `Nyt soi:`,
        `[${track.videoDetails.title}](${track.videoDetails.video_url})\njotain / ${trackLength}`,
        true
      )
      .addField('Biisiä toivo:', track.requestedBy?.toString() || '?', true)
      .setURL(track.videoDetails.video_url)

    if (track?.videoDetails?.thumbnails[0]?.url) {
      responseEmbed.setThumbnail(track.videoDetails.thumbnails[0].url)
    }

    if (!serverQueue.tracks[0]) {
      message.channel.send({ embeds: [responseEmbed] })
      return
    }

    const tracks = serverQueue.tracks.map(
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

    if (
      !serverQueue ||
      !serverQueue.nowPlaying ||
      !getVoiceConnection(guild.id)
    ) {
      message.channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
      return
    }

    const responseEmbed = new Discord.MessageEmbed()
    const track = serverQueue.nowPlaying
    const trackLength = msToReadable(
      Number(track.videoDetails.lengthSeconds) * 1000
    )

    responseEmbed
      .addField(
        `Nyt soi:`,
        `[${track.videoDetails.title}](${track.videoDetails.video_url})\njotain / ${trackLength}`,
        true
      )
      .setColor('#2f3136')
      .addField('Biisiä toivo:', track.requestedBy?.toString() || '?', true)

    if (track?.videoDetails?.thumbnails[0]?.url) {
      responseEmbed.setThumbnail(track.videoDetails.thumbnails[0].url)
    }

    message.channel.send({ embeds: [responseEmbed] })
    return
  }
}

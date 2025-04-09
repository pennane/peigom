import Discord, { Snowflake } from 'discord.js'
import { YOUTUBE_API_KEY } from '../lib/config'

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

import ytdl, { videoInfo } from '@distube/ytdl-core'
import { msToReadable, splitMessage } from '../lib/util'

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
  if (!queue) {
    console.error(`No queue found for guild ${guildId}`)
    return
  }
  console.log(track)
  console.log(track.videoDetails.video_url)

  queue.nowPlaying = track
  const stream = ytdl(track.videoDetails.video_url, {
    filter: 'audioonly',
    quality: 'lowest',
    requestOptions: {}
  })

  const resource = createAudioResource(stream)
  const connection = await connect(guildId)

  if (!connection) {
    console.error(`Failed to connect to the voice channel for guild ${guildId}`)
    queue.nowPlaying = null
    queue.stream = null
    return
  }

  queue.stream = stream
  const player = createAudioPlayer()

  connection.subscribe(player)
  player.play(resource)

  try {
    console.log(`Waiting for player to start playing...`)
    await entersState(player, AudioPlayerStatus.Playing, 10000)
    console.log(`Player started playing!`)
  } catch (error) {
    console.error(`Failed to enter the playing state: ${error}`)
    queue.nowPlaying = null
    queue.stream = null
    return startNext(guildId)
  }

  queue.nowPlaying = track

  try {
    console.log(`Waiting for player to go idle...`)
    await entersState(
      player,
      AudioPlayerStatus.Idle,
      Number(track.videoDetails.lengthSeconds) * 1000 + 2000
    )
    console.log(`Player is idle, track has finished`)
  } catch (e) {
    console.error(`Error waiting for idle state: ${e}`)
  } finally {
    queue.nowPlaying = null
    queue.stream = null
    console.log(`Cleaning up queue for guild ${guildId}`)
    startNext(guildId)
  }
}

export const queueMethods = {
  add: async function ({ guild, message, voiceChannel, track }: AddArguments) {
    const channel = message.channel
    if (channel.type !== Discord.ChannelType.GuildText) return
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

    const responseEmbed = new Discord.EmbedBuilder()
      .addFields([
        {
          name: `Jonoon lisätty`,
          value: `[${track.videoDetails.title}](${track.videoDetails.video_url})`
        },
        {
          name: `Pituus`,
          value: trackDuration,
          inline: true
        },
        {
          name: `Biisiä toivo`,
          value: track.requestedBy?.toString() || '?',
          inline: true
        }
      ])
      .setColor('#2f3136')
      .setURL(track.videoDetails.video_url)

    if (track.videoDetails.thumbnails[0].url) {
      responseEmbed.setThumbnail(track.videoDetails.thumbnails[0].url)
    }

    channel.send({ embeds: [responseEmbed] })

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
    const channel = message.channel
    if (channel.type !== Discord.ChannelType.GuildText) return
    const serverQueue = QueueMap.get(guild.id)
    if (!serverQueue) {
      channel.send(':hand_splayed: Bro, no keke')
      return
    }
    if (!serverQueue.nowPlaying) {
      channel.send(':hand_splayed: Bro, tyhjä keke ? impossible')
      return
    }

    channel.send(
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
    const channel = message.channel
    if (channel.type !== Discord.ChannelType.GuildText) return

    if (
      !serverQueue ||
      !serverQueue.nowPlaying ||
      !getVoiceConnection(guild.id)
    ) {
      return channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
    }
    const trackLength = msToReadable(
      Number(serverQueue.nowPlaying.videoDetails.lengthSeconds) * 1000
    )

    const track = serverQueue.nowPlaying

    const responseEmbed = new Discord.EmbedBuilder()
      .setColor('#2f3136')
      .addFields({
        name: 'Nyt soi',
        value: `[${track.videoDetails.title}](${track.videoDetails.video_url})\njotain / ${trackLength}`
      })
      .addFields({
        name: `Biisiä toivo`,
        value: track.requestedBy?.toString() || '?',
        inline: true
      })
      .setURL(track.videoDetails.video_url)

    if (track?.videoDetails?.thumbnails[0]?.url) {
      responseEmbed.setThumbnail(track.videoDetails.thumbnails[0].url)
    }

    if (!serverQueue.tracks[0]) {
      channel.send({ embeds: [responseEmbed] })
      return
    }

    const tracks = serverQueue.tracks.map(
      (track, i) =>
        `\`${i + 1}\`: [${track.videoDetails.title}](${
          track.videoDetails.video_url
        })`
    )
    const tracksMessage = tracks.join('\n')
    const parts = splitMessage(tracksMessage, { maxLength: 950 })
    const first = parts[0]
    const rest = parts.slice(1, 2)

    responseEmbed.addFields({ name: 'Seuraavana', value: first })

    if (!rest) {
      channel.send({ embeds: [responseEmbed] })
      return
    }

    for (const part of rest) {
      responseEmbed.addFields({ name: '\u200b', value: part })
    }

    channel.send({ embeds: [responseEmbed] })

    return
  },
  nowPlaying: function ({
    guild,
    message
  }: {
    guild: Discord.Guild
    message: Discord.Message
  }) {
    const channel = message.channel
    if (channel.type !== Discord.ChannelType.GuildText) return
    const serverQueue = QueueMap.get(guild.id)

    if (
      !serverQueue ||
      !serverQueue.nowPlaying ||
      !getVoiceConnection(guild.id)
    ) {
      channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
      return
    }

    const responseEmbed = new Discord.EmbedBuilder()
    const track = serverQueue.nowPlaying
    const trackLength = msToReadable(
      Number(track.videoDetails.lengthSeconds) * 1000
    )

    responseEmbed
      .addFields({
        name: 'Nyt soi',
        value: `[${track.videoDetails.title}](${track.videoDetails.video_url})\njotain / ${trackLength}`
      })
      .setColor('#2f3136')
      .addFields({
        name: `Biisiä toivo`,
        value: track.requestedBy?.toString() || '?',
        inline: true
      })

    if (track?.videoDetails?.thumbnails[0]?.url) {
      responseEmbed.setThumbnail(track.videoDetails.thumbnails[0].url)
    }

    channel.send({ embeds: [responseEmbed] })
    return
  }
}

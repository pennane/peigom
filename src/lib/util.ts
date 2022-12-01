import Discord from 'discord.js'
import { Track, yt } from '../sound_handling/sound'
import fs from 'fs'
import https from 'https'
import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  PlayerSubscription,
  VoiceConnectionStatus
} from '@discordjs/voice'
import ytdl from 'ytdl-core'
import memoize from 'memoizee'

export function arrayToChunks<T>(arr: T[], chunkSize: number): Array<T[]> {
  const chunks = []
  while (arr.length > 0) {
    const chunk = arr.splice(0, chunkSize)
    chunks.push(chunk)
  }
  return chunks
}

export function fetchFile({
  url,
  target
}: {
  url: string
  target: string
}): Promise<string> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(target)

    https.get(url, function (response) {
      response.pipe(file)
    })

    file.on('finish', function () {
      resolve(target)
    })
  })
}

export function msToReadable(ms: number) {
  const min = Math.floor(ms / 60000)
  const sec = ((ms % 60000) / 1000).toFixed(0)
  return min + ':' + (Number(sec) < 10 ? '0' : '') + sec
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const s = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[s]] = [a[s], a[i]]
  }
  return a
}

export function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export class ServerQueue {
  guild: Discord.Guild
  voiceChannel: Discord.VoiceChannel
  audioPlayer: AudioPlayer
  resource: AudioResource<null> | null
  tracks: Track[]
  options: {
    volume: number
  }
  subscription?: PlayerSubscription

  constructor({
    voiceChannel,
    guild
  }: {
    voiceChannel: Discord.VoiceChannel
    guild: Discord.Guild
  }) {
    this.guild = guild
    this.voiceChannel = voiceChannel

    this.resource = null
    this.tracks = []

    this.options = {
      volume: 1
    }

    this.audioPlayer = createAudioPlayer()
    this.audioPlayer.on('error', (error) => {
      console.error(`Error: ${error.message} with resource ${error.resource}`)
    })
    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      this.playNextResource(true)
    })
  }

  disconnect() {
    this.tracks = []
    this.audioPlayer.stop()

    return getVoiceConnection(this.guild.id)?.destroy()
  }

  getIsConnected() {
    return !!getVoiceConnection(this.guild.id)
  }

  handleDisconnect() {
    this.disconnect()
  }

  async connect(forceNew: boolean) {
    const existingConnection = !forceNew && getVoiceConnection(this.guild.id)
    const connection =
      existingConnection ||
      joinVoiceChannel({
        guildId: this.guild.id,
        channelId: this.voiceChannel.id,
        adapterCreator: this.voiceChannel.guild.voiceAdapterCreator
      })

    if (connection.state.status !== VoiceConnectionStatus.Ready) {
      await new Promise((resolve) =>
        connection.addListener(VoiceConnectionStatus.Ready, (a) => resolve(a))
      )
    }
    connection.removeListener(
      VoiceConnectionStatus.Destroyed,
      this.handleDisconnect
    )
    connection.on(VoiceConnectionStatus.Destroyed, this.handleDisconnect)

    return connection
  }

  getPlayer() {
    const player = this.audioPlayer

    return player
  }

  updateVoicechannel(c: Discord.VoiceChannel) {
    this.voiceChannel = c
    this.connect(true)
  }

  getIsPlaying() {
    return this.getIsConnected() && this.tracks.length > 0
  }

  async playNextResource(shift: boolean, retries = 0): Promise<void> {
    if (shift) {
      this.tracks.shift()
    }

    const track = this.tracks[0]
    if (!track) {
      this.getPlayer().stop()
      this.subscription?.unsubscribe()
      return
    }

    const stream = ytdl(track.videoDetails.video_url, {
      filter: 'audioonly',
      quality: 'lowest'
    })

    const resource = createAudioResource(stream, { inlineVolume: true })
    resource.volume?.setVolume(this.options.volume)
    this.resource = resource

    const connection = await this.connect(false)

    const player = this.getPlayer()

    player.play(resource)
    try {
      await entersState(player, AudioPlayerStatus.Playing, 5_000)
    } catch (error) {
      if (retries < 5) {
        return this.playNextResource(false, retries + 1)
      }
      return this.playNextResource(true)
    }

    this.subscription = connection.subscribe(player)
  }

  clearQueue() {
    if (this.tracks.length === 0) return
    this.tracks = [this.tracks[0]]
  }
  addTrack(track: Track) {
    this.tracks = this.tracks.concat(track)
  }
  addTrackToTop(track: Track) {
    if (this.tracks.length === 0) return this.addTrack(track)
    const [firstTrack, ...restTracks] = this.tracks
    this.tracks = [firstTrack, track, ...restTracks]
  }
}

const YOUTUBE_LINK_REGEX =
  /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?[\w?=]*)?/

const getSearchResults = memoize(
  async (searchString: string) => {
    return await yt.searchVideos(searchString, 1, { part: 'id' })
  },
  {
    promise: true,
    maxAge: 1000 * 60 * 60 * 24 // one day
  }
)
const getBasicInfo = memoize(
  async (searchString: string) => {
    return await ytdl.getBasicInfo(searchString)
  },
  {
    promise: true,
    maxAge: 1000 * 60 * 60 * 24 // one day
  }
)

export const getYoutubeVideo = memoize(
  async (searchString: string) => {
    if (YOUTUBE_LINK_REGEX.test(searchString)) {
      const timeout0 = setTimeout(() => {
        throw new Error('Failed to fetch :(')
      }, 5_000)

      const track = await getBasicInfo(searchString)

      clearTimeout(timeout0)

      return track
    }
    const timeout1 = setTimeout(() => {
      throw new Error('Failed to fetch :(')
    }, 5_000)

    const searchResults = await getSearchResults(searchString)

    clearTimeout(timeout1)

    const timeout2 = setTimeout(() => {
      throw new Error('Failed to fetch :(')
    }, 5_000)

    const info = await getBasicInfo(searchResults[0].url)

    clearTimeout(timeout2)

    return info
  },
  {
    promise: true,
    maxAge: 1000 * 60 * 60 * 24 // one day
  }
)

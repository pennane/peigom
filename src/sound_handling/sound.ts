import { YOUTUBE_API_KEY } from '../util/config'
import Discord from 'discord.js'
import ytdl, { videoInfo } from 'ytdl-core'
import { buildInitialServerQueue, msToReadable, shuffleArray } from '../util/misc'

const Youtube = require('simple-youtube-api')

export const yt = new Youtube(YOUTUBE_API_KEY)

const QueueMap: Map<string, ServerQueue> = new Map()

export interface Track extends videoInfo {
    requestedBy?: Discord.GuildMember
    toTop?: boolean
}

export interface ServerQueue {
    voiceChannel: Discord.VoiceChannel
    guild: Discord.Guild
    connection: Discord.VoiceConnection | null
    tracks: Track[]
    options: {
        volume: number
    }
    searching: {
        state: boolean
        time: Date
    }
}

async function dispatch(guild: Discord.Guild) {
    let serverQueue = QueueMap.get(guild.id)
    if (!serverQueue) return

    if (!serverQueue.connection) {
        let connection = await serverQueue.voiceChannel.join()
        connection.on('disconnect', (e) => {
            QueueMap.delete(guild.id)
            if (serverQueue?.tracks) {
                serverQueue.tracks = []
            }
        })
        serverQueue.connection = connection
    }

    let track = serverQueue.tracks[0]

    if (!track) {
        QueueMap.delete(guild.id)
        setTimeout(() => {
            if (!serverQueue?.voiceChannel) return
            serverQueue.voiceChannel.leave()
        }, 5 * 1000 * 60)
        return
    }

    const stream = ytdl(track.videoDetails.video_url, { filter: 'audioonly', quality: 'lowest' })

    let dispatcher = serverQueue.connection.play(stream, { volume: serverQueue.options.volume })

    dispatcher.on('finish', (reason: string) => {
        console.log('finished')
        let serverQueue = QueueMap.get(guild.id)
        if (!serverQueue) return

        serverQueue.tracks = serverQueue.tracks.slice(1)

        setTimeout(() => {
            dispatch(guild)
        }, 1000)
    })
    dispatcher.on('error', (err) => {
        if (!serverQueue) return
        console.info('error in dispatcher:', err)
        serverQueue.tracks.shift()

        setTimeout(() => {
            dispatch(guild)
        }, 1000)
    })
}

interface AddArguments {
    guild: Discord.Guild
    message: Discord.Message
    voiceChannel: Discord.VoiceChannel
    track: Track
}

export const queueMethods = {
    add: async function ({ guild, message, voiceChannel, track }: AddArguments) {
        let serverQueue: ServerQueue

        if (QueueMap.has(guild.id)) {
            serverQueue = QueueMap.get(guild.id) as ServerQueue
        } else {
            serverQueue = buildInitialServerQueue({ guild, voiceChannel })
            QueueMap.set(guild.id, serverQueue)
        }

        const trackDuration = msToReadable(Number(track.videoDetails.lengthSeconds) * 1000)

        const responseEmbed = new Discord.MessageEmbed()
            .setAuthor(`Jonoon lisätty 🎵`, track.thumbnail_url, track.videoDetails.video_url)
            .addField(`[${track.videoDetails.title}](${track.videoDetails.video_url})`, track.videoDetails.author.name)
            .setColor('RANDOM')
            .addField('Pituus', trackDuration, true)
            .setTimestamp()

        if (track.thumbnail_url) {
            responseEmbed.setThumbnail(track.thumbnail_url)
        }

        message.channel.send(responseEmbed)

        if (!serverQueue.connection) {
            let connection = await voiceChannel.join()

            connection.on('disconnect', (e) => {
                QueueMap.delete(guild.id)
                if (serverQueue?.tracks) {
                    serverQueue.tracks = []
                }
            })

            serverQueue.connection = connection
            serverQueue.tracks.push(track)

            dispatch(guild)
            return
        }

        if (track.toTop) {
            serverQueue.tracks = [serverQueue.tracks[0], track, ...serverQueue.tracks.slice(1)]
        } else {
            serverQueue.tracks.push(track)
        }
    },
    show: function ({ guild, message }: { guild: Discord.Guild; message: Discord.Message }) {
        let serverQueue = QueueMap.get(guild.id)
        if (!serverQueue || serverQueue.tracks.length === 0) {
            message.channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
            return
        }

        let responseEmbed = new Discord.MessageEmbed()
            .setAuthor(`Jono kanavalla ${guild.name}`)
            .setColor('RANDOM')
            .addField(
                `Nyt soi:`,
                `${serverQueue.tracks[0].videoDetails.title} | Biisiä pyys: ${serverQueue.tracks[0].requestedBy}`,
                false
            )
            .setTimestamp()

        if (serverQueue.tracks.length > 1) {
            responseEmbed.addField(
                'Seuraavana:',
                `${serverQueue.tracks
                    .slice(1)
                    .map((track, i) => `\`${i + 1}\`: [${track.videoDetails.title}](${track.videoDetails.video_url})`)
                    .join(`\n`)}`
            )
        }

        message.channel.send(responseEmbed)
        return
    },
    nowPlaying: function ({ guild, message }: { guild: Discord.Guild; message: Discord.Message }) {
        let serverQueue = QueueMap.get(guild.id)

        if (!serverQueue) {
            message.channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
            return
        }

        if (serverQueue.tracks.length === 0 || !serverQueue.connection?.speaking) {
            return message.channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
        }

        let responseEmbed = new Discord.MessageEmbed()

        let track = serverQueue.tracks[0]
        let playedTime = msToReadable(serverQueue.connection.dispatcher.streamTime)
        let trackLength = msToReadable(Number(serverQueue.tracks[0].videoDetails.lengthSeconds) * 1000)

        responseEmbed
            .setAuthor(`Ny soi: 🎵`, track.thumbnail_url, track.videoDetails.video_url)
            .setColor('RANDOM')
            .addField(`${serverQueue.tracks[0].videoDetails.title}`, `${playedTime} / ${trackLength}`, true)
            .addField('Biisiä toivo:', track.requestedBy || '?', true)
            .setTimestamp()

        if (track.thumbnail_url) {
            responseEmbed.setThumbnail(track.thumbnail_url)
        }

        message.channel.send(responseEmbed)
        return
    },
    skip: function ({ guild, message }: { guild: Discord.Guild; message: Discord.Message }) {
        let serverQueue = QueueMap.get(guild.id)

        if (!serverQueue || !serverQueue?.connection?.dispatcher) {
            message.channel.send(':hand_splayed: Bro, ei täällä soi mikään.')
            return
        }

        message.channel.send(`:track_next: ${serverQueue.tracks[0].videoDetails.title} skipattu!`)
        serverQueue.connection.dispatcher.end('skip')
    },
    disconnect: function ({ guild, message }: { guild: Discord.Guild; message: Discord.Message }) {
        let serverQueue = QueueMap.get(guild.id)

        if (serverQueue?.connection) {
            serverQueue.tracks = []
            serverQueue.connection.dispatcher.end('disconnect command')
        }

        if (guild.me?.voice.channel) {
            guild.me.voice.channel.leave()
            return message.channel.send(':wave: Ilosesti böneen!')
        }

        return message.channel.send(':x: En edes ollut kiusaamassa.')
    },
    clear: function ({ guild, message }: { guild: Discord.Guild; message: Discord.Message }) {
        let serverQueue = QueueMap.get(guild.id)

        if (!serverQueue || serverQueue.tracks.length <= 1) {
            message.channel.send(':x: Ei ollut mitään mitä puhdistaa, >:^U')
            return
        }

        serverQueue.tracks = [serverQueue.tracks[0]]
        message.channel.send(':wastebasket:  Musiikkijono tyhjennetty!')
    },
    shuffle: function ({ guild, message }: { guild: Discord.Guild; message: Discord.Message }) {
        let serverQueue = QueueMap.get(guild.id)

        if (!serverQueue || serverQueue.tracks.length < 3) {
            message.channel.send(':hand_splayed: Bro, ei pyge sekottaa')
            return
        }

        serverQueue.tracks = [serverQueue.tracks[0], ...shuffleArray(serverQueue.tracks.slice(1))]
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
        let serverQueue = QueueMap.get(guild.id)

        if (!serverQueue) {
            return message.channel.send(':hand_splayed: Bro, ei voi poistaa. Duunasikko oikein?')
        }

        let track = [...serverQueue.tracks][toRemove]
        serverQueue.tracks = serverQueue.tracks.filter((_track, i) => i !== toRemove)
        message.channel.send(`:ok: Kappale \`${track.videoDetails.title}\` on poistettu jonosta.`)
        return
    },
    pause: function ({ guild }: { guild: Discord.Guild }) {
        let serverQueue = QueueMap.get(guild.id)

        // TODO
    },
    resume: function ({ guild }: { guild: Discord.Guild }) {
        let serverQueue = QueueMap.get(guild.id)

        // TODO
    },
    volume: function ({ guild, message, volume }: { guild: Discord.Guild; message: Discord.Message; volume: string }) {
        let serverQueue = QueueMap.get(guild.id)

        if (!serverQueue?.connection?.dispatcher) return

        if (!volume) {
            message.channel.send('Tän hetkinen volyymi on ' + serverQueue.options.volume)
            return
        }

        let computedVolume = parseFloat(volume.replace(',', '.'))

        if (computedVolume >= 0) {
            serverQueue.connection.dispatcher.setVolume(computedVolume)
            serverQueue.options.volume = computedVolume
            message.channel.send('Volyymiks asetettu ' + computedVolume)
            return
        } else {
            message.channel.send('Tän hetkinen volyymi on ' + serverQueue.options.volume)
            return
        }
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
    changeChannel: function ({ guild, message }: { guild: Discord.Guild; message: Discord.Message }) {
        const serverQueue = QueueMap.get(guild.id)
        const newChannel = message.member?.voice.channel

        if (!serverQueue || !newChannel) return

        if (serverQueue.voiceChannel.id === newChannel.id) return

        newChannel.join()

        serverQueue.voiceChannel = newChannel

        return
    }
}

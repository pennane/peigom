import Discord from 'discord.js'
import { ServerQueue } from '../sound_handling/sound'
import fs from 'fs'
import https from 'https'

export function arrayToChunks<T>(arr: T[], chunkSize: number): Array<T[]> {
    const chunks = []
    while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize)
        chunks.push(chunk)
    }
    return chunks
}

export function fetchFile({ url, target }: { url: string; target: string }): Promise<string> {
    return new Promise((resolve, reject) => {
        let file = fs.createWriteStream(target)

        https.get(url, function (response) {
            response.pipe(file)
        })

        file.on('finish', function () {
            resolve(target)
        })
    })
}

export function msToReadable(ms: number) {
    let min = Math.floor(ms / 60000)
    let sec = ((ms % 60000) / 1000).toFixed(0)
    return min + ':' + (Number(sec) < 10 ? '0' : '') + sec
}

export function shuffleArray<T>(arr: T[]): T[] {
    let a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const s = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[s]] = [a[s], a[i]]
    }
    return a
}

export function randomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

export function buildInitialServerQueue({
    voiceChannel,
    guild
}: {
    voiceChannel: Discord.VoiceChannel
    guild: Discord.Guild
}): ServerQueue {
    return {
        voiceChannel: voiceChannel,
        guild: guild,
        connection: null,
        player: null,
        tracks: [],
        options: {
            volume: 1
        },
        searching: {
            state: false,
            time: new Date()
        }
    }
}

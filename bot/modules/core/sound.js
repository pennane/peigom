const key = require('../../config/authorize.json')["youtube-api-key"]
const queue = new Map()

const Discord = require('discord.js')
const YouTube = require('simple-youtube-api')
const ytdl = require('ytdl-core');
const yt = new YouTube(key);

let searching = { state: false, time: new Date() };

function msToReadable(ms) {
    let min = Math.floor(ms / 60000);
    let sec = ((ms % 60000) / 1000).toFixed(0);

    return min + ":" + (sec < 10 ? '0' : '') + sec;
}

function shuffle(arr) {
    let a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const s = Math.floor(Math.random() * (i + 1));
        [a[i], a[s]] = [a[s], a[i]];
    }
    return a;
}

function buildQueue({ textChannel, voiceChannel, guild }) {
    return {
        textChannel: textChannel,
        voiceChannel: voiceChannel,
        guild: guild,
        connection: null,
        tracks: [],
        options: {
            volume: 1
        }
    }

}

function play(guild) {
    let serverQueue = queue.get(guild.id)

    if (!serverQueue) {
        return console.info("ERROR: NO SERVER QUEUE ?")
    }
    if (serverQueue.connection.channel.members.size <= 1) {
        queue.delete(guild.id)
        serverQueue.connection.disconnect();
        return;
    }

    serverQueue.connection.dispatcher = undefined;
    serverQueue.dispatcher = undefined;

    let track = serverQueue.tracks[0]

    if (!track) {
        queue.delete(guild.id)
        setTimeout(() => {
            if (queueMethods.isPlaying({ guild: guild })) {
                return;
            }
            serverQueue.voiceChannel.leave()
        }, 5 * 1000 * 60)
        return;
    }
    let stream = ytdl(track.video_url, { filter: "audioonly", quality: "lowest" })
    let dispatcher = serverQueue.connection.play(stream, { volume: serverQueue.options.volume })
    serverQueue.dispatcher = dispatcher
    dispatcher.on('finish', (reason) => {
        setTimeout(() => {
            serverQueue.tracks.shift()
            serverQueue.connection.dispatcher = undefined;
            serverQueue.dispatcher = undefined;

            setTimeout(() => {
                play(guild)
            }, 1000)

        }, 200)
    })

    dispatcher.on('error', (err) => {
        console.info('error in dispatcher:', err)
        serverQueue.tracks.shift()
        serverQueue.connection.dispatcher = undefined;
        serverQueue.dispatcher = undefined;

        setTimeout(() => {
            play(guild)
        }, 1000)
    })
}

const queueMethods = {
    add: function (args) {

        async function run(args) {
            searching = { state: true, time: new Date() };
            let { track, guild, voiceChannel, msg } = args
            let serverQueue = await queue.get(guild.id)
            let ytTime = msToReadable(track.length_seconds * 1000)
            let embed = new Discord.MessageEmbed()
                .setAuthor(`Jonoon lisätty 🎵`, track.thumbnail_url, track.video_url)
                .addField(track.title, track.author.name)
                .setColor('RANDOM')
                .addField('Pituus', ytTime, true)
                .setThumbnail(track.thumbnail_url || null)
                .setTimestamp();

            if (!serverQueue || (!serverQueue.connection || !serverQueue.connection.speaking)) {
                queue.set(guild.id, buildQueue(args))
                serverQueue = await queue.get(guild.id)
                try {
                    let connection = voiceChannel.join()
                    serverQueue.connection = await connection;
                    serverQueue.tracks.push(track)
                    play(guild)
                } catch (err) {
                    console.error("COULD NOT START CONNECTION:", err)
                    queue.delete(guild.id)
                }
            } else if (track.toTop && serverQueue.tracks.length > 1) {
                serverQueue.tracks = [serverQueue.tracks[0], track, ...[...serverQueue.tracks].splice(1)]
            } else {
                serverQueue.tracks.push(track)
            }

            msg.channel.send(await embed).then(() => {
                searching = { state: false, time: new Date() };
            })

        }

        function timeout() {
            setTimeout(function () {
                if (searching.state) timeout();
                else run(args)
            }, 100);
        }

        if (searching) timeout();
        else run(args)

    },
    show: function (args) {
        let { guild, msg } = args
        let serverQueue = queue.get(guild.id)

        if (!serverQueue) {
            msg.channel.send(":hand_splayed: Bro, ei täällä soi mikään.")
        } else if (serverQueue.tracks.length > 0) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`Jono kanavalla ${guild.name}`)
                .setColor('RANDOM')
                .addField(`Nyt soi:`, `${serverQueue.tracks[0].title} | Biisiä pyys: ${serverQueue.tracks[0].requestedBy}`, false)
                .setTimestamp();
            if (serverQueue.tracks.length > 1) {
                embed.addField('Seuraavana:', `${
                    [...serverQueue.tracks].splice(1).map((t, i) => `\`${i + 1}\`: [${t.title}](${t.video_url})`).join(`\n`)
                    }`);

            }
            msg.channel.send(embed)

        } else {
            msg.channel.send(":hand_splayed: Bro, ei täällä soi mikään.")
        }
    },
    nowPlaying: function (args) {
        let { guild, msg } = args
        let serverQueue = queue.get(guild.id)

        if (!serverQueue) {
            msg.channel.send(":hand_splayed: Bro, ei täällä soi mikään.")
        } else if (serverQueue.tracks.length > 0 && serverQueue.connection && serverQueue.connection.speaking) {
            let embed = new Discord.MessageEmbed();
            let track = serverQueue.tracks[0];
            let dpTime = msToReadable(serverQueue.connection.dispatcher.streamTime)
            let ytTime = msToReadable(serverQueue.tracks[0].length_seconds * 1000)
            embed
                .setAuthor(`Ny soi: 🎵`, track.thumbnail_url, track.video_url)
                .setColor('RANDOM')
                .addField(`${serverQueue.tracks[0].title}`, `${dpTime} / ${ytTime}`, true)
                .addField('Biisiä toivo:', track.requestedBy || '?', true)
                .setThumbnail(track.thumbnail_url || null)
                .setTimestamp();

            msg.channel.send(embed).catch(console.info)
        } else {
            msg.channel.send(":hand_splayed: Bro, ei täällä soi mikään.")
        }
    },
    skip: function (args) {
        let { guild, msg } = args
        let serverQueue = queue.get(guild.id)
        if (!serverQueue) {
            msg.channel.send(":hand_splayed: Bro, ei täällä soi mikään.")
            return
        }

        let connection = serverQueue.connection

        if (serverQueue && connection && (connection.dispatcher || connection.speaking === true)) {
            msg.channel.send(`:track_next: ${serverQueue.tracks[0].title} skipattu!`)
            serverQueue.connection.dispatcher.end('skip')
        } else {
            msg.channel.send(":hand_splayed: Bro, ei täällä soi mikään.")
        }
    },
    disconnect: function (args) {
        let { guild, msg } = args
        let serverQueue = queue.get(guild.id)

        if (serverQueue) {
            serverQueue.tracks = []
            serverQueue.connection.dispatcher.end("disconnect command")

        }

        if (guild.me.voice.channel) {
            guild.me.voice.channel.leave()
            msg.channel.send(":wave: Ilosesti böneen!")
        }
        else {
            msg.channel.send(":x: En edes ollut kiusaamassa.")
        }


    },
    clear: function (args) {
        let { guild, msg } = args
        let serverQueue = queue.get(guild.id)

        if (serverQueue && serverQueue.connection.dispatcher) {
            serverQueue.tracks = [serverQueue.tracks[0]]
            msg.channel.send(":wastebasket:  Musiikkijono tyhjennetty!")
        } else {
            msg.channel.send(":x: Ei ollut mitään mitä puhdistaa, >:^U")
        }
    },
    shuffle: function (args) {
        let { guild, msg } = args
        let serverQueue = queue.get(guild.id)
        if (serverQueue && serverQueue.tracks && serverQueue.tracks.length > 2) {
            serverQueue.tracks = [serverQueue.tracks[0], ...shuffle([...serverQueue.tracks].splice(1))]
            msg.channel.send(":ok_hand: Sekotettu niinku tehosekoti")
        } else {
            msg.channel.send(":hand_splayed: Bro, ei oo mitään mitä sekottaa")
        }
    },
    remove: function (args) {
        let { guild, msg, toRemove } = args
        let serverQueue = queue.get(guild.id)
        if (serverQueue && serverQueue.tracks && serverQueue.tracks.length > 1 && toRemove && parseInt(toRemove) > 0 && serverQueue.tracks[parseInt(toRemove)]) {
            let track = [...serverQueue.tracks][toRemove]
            let rm = parseInt(toRemove)
            serverQueue.tracks = serverQueue.tracks.filter((e, i) => i !== rm)
            msg.channel.send(`:ok: Kappale \`${track.title}\` on poistettu jonosta.`)
        } else {
            msg.channel.send(":hand_splayed: Bro, ei voi poistaa. Duunasikko oikein?")
        }
    },
    pause: function (args) {
        let { guild } = args
        let serverQueue = queue.get(guild.id)
        if (serverQueue && serverQueue.dispatcher && !serverQueue.dispatcher.paused) {
            serverQueue.dispatcher.pause()
        }
    },
    resume: function (args) {
        let { guild } = args
        let serverQueue = queue.get(guild.id)
        if (serverQueue && serverQueue.dispatcher && serverQueue.dispatcher.paused) {
            serverQueue.dispatcher.resume()
        }
    },
    volume: function (args) {
        let { guild, volume } = args
        let serverQueue = queue.get(guild.id)
        if (serverQueue && serverQueue.dispatcher) {
            let computedVolume = parseFloat(volume.replace(",", "."))
            if (!computedVolume > 0) return;
            serverQueue.dispatcher.setVolume(computedVolume)
            serverQueue.options.volume = computedVolume
        }
    },
    isPlaying: function (args) {
        let { guild } = args

        if (!guild) {
            return false;
        }

        serverQueue = queue.get(guild.id)

        if (!serverQueue) {
            return false;
        }

        if (serverQueue.tracks.length > 0 && serverQueue.connection) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = {
    yt: yt,
    queue: queueMethods
}

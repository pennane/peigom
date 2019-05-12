const YouTube = require('simple-youtube-api')
const ytdl = require('ytdl-core');
const key = require('../../config/authorize.json')["youtube-api-key"]

const yt = new YouTube(key);
const queue = new Map()

function msToReadable(ms) {
    let min = Math.floor(ms / 60000);
    let sec = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function buildQueue({ textChannel, voiceChannel, guild }) {
    return {
        textChannel: textChannel,
        voiceChannel: voiceChannel,
        guild: guild,
        connection: null,
        tracks: [],
        volume: 5,
        playing: true
    }

}

function play(guild) {
    let serverQueue = queue.get(guild.id)
    let track = serverQueue.tracks[0]
    if (!track) {
        serverQueue.voiceChannel.leave()
        queue.delete(guild.id)
        return;
    }
    let dispatcher = serverQueue.connection.playStream(ytdl(track.url))
    console.log(dispatcher)
    dispatcher.on('end', () => {
        setTimeout(()=>{
            serverQueue.tracks.shift()
            play(guild)
        },1000)
        
    })
}

module.exports = {
    yt: yt,
    queue: {
        add: async function (args) {
            console.log(args.track)
            let { track, guild, voiceChannel } = args
            let serverQueue = await queue.get(guild.id)
            if (await !serverQueue) {
                queue.set(guild.id, buildQueue(args))
                serverQueue = await queue.get(guild.id)
                try {
                    let connection = voiceChannel.join()
                    serverQueue.connection = await connection;
                    await serverQueue.tracks.push(track)
                    play(guild)
                } catch (err) {
                    console.error("COULD NOT START CONNECTION:",err)
                    queue.delete(guild.id)
                }

            } else {
                serverQueue.tracks.push(track)
            }
        },
        show: function (args) {
            let { guild, msg } = args
            let serverQueue = queue.get(guild.id)
            if (!serverQueue) {
                msg.channel.send("Bro, ei täällä soi mikään.")
            } else if (serverQueue.tracks.length > 0){
                
                msg.channel.send(serverQueue.tracks.map((t, i) => `${i}: ${t.title}`).join(`\n`))
            } else {
                msg.channel.send("Bro, ei täällä soi mikään.")
            }
        },
        nowPlaying: function (args) {
            let { guild, msg } = args
            let serverQueue = queue.get(guild.id)
            if (!serverQueue) {
                msg.channel.send("Bro, ei täällä soi mikään.")
            } else if (serverQueue.tracks.length > 0){
                let dpTime = msToReadable(serverQueue.connection.dispatcher.time)
                let ytTime = serverQueue.tracks[0].duration
                msg.channel.send(`Nyt soi: \n${serverQueue.tracks[0].title}\n${dpTime} / ${ytTime.minutes} : ${ytTime.seconds}`)
                console.log(`Nyt soi: \n${serverQueue.tracks[0].title}\n${dpTime} / ${ytTime.minutes} : ${ytTime.seconds}`)
            } else {
                msg.channel.send("Bro, ei täällä soi mikään.")
            }
        },
        skip: function (args) {
            let { guild, msg } = args
            let serverQueue = queue.get(guild.id)
            if (!serverQueue) {
                msg.channel.send("Bro, ei täällä soi mikään.")
            } else if (serverQueue.tracks.length > 0){
                serverQueue.connection.dispatcher.end('skip')
            } else {
                msg.channel.send("Bro, ei täällä soi mikään.")
            }
        },
        pause: function (args) {// pause ei toimi toivotusti
            let { guild, msg } = args
            let serverQueue = queue.get(guild.id)
            if (!serverQueue) {
                msg.channel.send("Bro, ei täällä soi mikään.")
            } else if (serverQueue.connection && serverQueue.connection.dispatcher && serverQueue.connection.dispatcher.paused === false){
                serverQueue.connection.dispatcher.pause('pause')
            } else {
                msg.channel.send("Bro, ei pyge pausee")
            }
        },
        resume: function (args) {// resume ei toimi toivotusti
            let { guild, msg } = args
            let serverQueue = queue.get(guild.id)
            if (!serverQueue) {
                msg.channel.send("Bro, ei täällä soi mikään.")
            } else if (serverQueue.connection.dispatcher.paused === true){
                serverQueue.connection.dispatcher.resume('pause')
            } else {
                msg.channel.send("Bro, ei pyge palaa")
            }
        },
        disconnect: function(args) {

        } 
    }
}
const Discord = require('discord.js');
const ytdl = require('ytdl-core')

const { yt, queue } = require('../core/sound.js')

let embed = new Discord.RichEmbed().setColor(0xF4E542);
let ytRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/

const meta = {
    name: "playtop",
    admin: false,
    syntax: "play <hakusanat / linkki>",
    desc: "soita musiikkia youtubesta ja viskoo sen ekaksi jonoon",
    triggers: ["playtop", "pt"],
    type:  ["music"]
}

module.exports.run = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let voiceChannel = msg.member.voiceChannel;
        let textChannel = msg.channel;
        let guild = msg.guild;

        if (!voiceChannel) return resolve(msg.reply("Mene ensin jollekin puhekanavalle, kid."))

        let query = [...args].splice(1).join(" ")
        let url = [...args][1].replace(/<(.+)>/g, '$1')
        let video;
        
        if (url.match(ytRegex)) {
            msg.channel.send(`:mag: Etitään \`${url}\``)
            video = await ytdl.getBasicInfo(url)
        } else {
            msg.channel.send(`:mag: Etitään \`${query}\``)
            try {
                let queried = await yt.searchVideos(query, 1, { part: 'id' })
                video = await ytdl.getBasicInfo(queried[0].id)
            } catch (err) {
                video = null;
                msg.reply(":baby: Ei löy'y tollasta vidii bro")
            }
        }
        if (await video) {
            video.requestedBy = msg.member;
            video.toTop = true;
            queue.add({
                track: video,
                textChannel: textChannel,
                voiceChannel: voiceChannel,
                guild: guild,
                msg: msg
            })
        } else {
            msg.channel.send(":baby: Bro en voi soittaa tota, bro")
        }
        resolve()
    });
}
module.exports.meta = meta;
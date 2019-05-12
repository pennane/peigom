const Discord = require('discord.js');

const { yt, queue } = require('../core/sound.js')

let embed = new Discord.RichEmbed().setColor(0xF4E542);
let ytRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/

const meta = {
    name: "playtop",
    admin: false,
    syntax: "play <hakusanat / linkki>",
    desc: "soita musiikkia youtubesta ja viskoo sen ekaksi jonoon",
    triggers: ["playtop", "pt"]
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
            video = await yt.getVideo(url, { part: 'id,snippet2,contentDetails' })
        } else {
            try {
                let queried = await yt.searchVideos(query, 1, { part: 'id' })
                video = await yt.getVideoByID(queried[0].id, { part: 'id,snippet,contentDetails' });
            } catch (err) {
                video = null;
                msg.reply("Ei löy'y tollasta vidii bro")
            }
        }

        if (video) {
            video.user = msg.member;
            video.toTop = true;
            queue.add({
                track: video,
                textChannel: textChannel,
                voiceChannel: voiceChannel,
                guild: guild,
            })
        }
        resolve()
    });
}
module.exports.meta = meta;
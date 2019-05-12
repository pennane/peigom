const Discord = require('discord.js');

const {yt, queue} = require('../core/sound.js')

let embed = new Discord.RichEmbed().setColor(0xF4E542);


const meta = {
    name: "play",
    admin: false,
    syntax: "play <hakusanat / linkki>",
    desc: "soita musiikkia youtubesta",
    triggers: ["play", "p", "soita"]
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
        try {
            video = await yt.getVideo(url)
        } catch (err) {
            video = undefined;
            try {
                let queried = await yt.searchVideos(query, 10)
                video = await yt.getVideoByID(queried[0].id);
            } catch (err) {
                video = undefined;
                console.log(err)
                msg.reply("Ei löy'y tollasta vidii bro")
            }
        } finally {
            if (video) queue.add({track: video, textChannel: textChannel, voiceChannel: voiceChannel, guild: guild}) 
            return resolve()
        }

    });
}
module.exports.meta = meta;
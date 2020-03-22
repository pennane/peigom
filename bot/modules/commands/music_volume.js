const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')

const { queue } = require('../core/sound.js')

let embed = new Discord.MessageEmbed().setColor(0xF4E542);


const meta = {
    name: "volume",
    admin: true,
    syntax: "volume 1-infinity",
    desc: "vaihtaa äänenpainetta",
    triggers: ["volume", "vol"],
    type: ["music"]
}

module.exports.run = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.volume({ guild: guild, msg: msg, volume: args[1] })
        resolve()
    });
}
module.exports.meta = meta;
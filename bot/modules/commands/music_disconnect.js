const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')

const {queue} = require('../core/sound.js')

let embed = new Discord.RichEmbed().setColor(0xF4E542);


const meta = {
    name: "disconnect",
    admin: false,
    syntax: "disconenct",
    desc: "Lopettaa soittamisen ja lähtee böneen.",
    triggers: ["dc", "disconnect"],
    type:  ["music"]
}

module.exports.run = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.disconnect({guild: guild, msg: msg})
        resolve()
    });
}
module.exports.meta = meta;
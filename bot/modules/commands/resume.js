const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')

const {queue} = require('../core/sound.js')

let embed = new Discord.RichEmbed().setColor(0xF4E542);


const meta = {
    name: "resume",
    admin: false,
    syntax: "resume",
    desc: "laittaa musat takas, mikäli mahollista",
    triggers: ["resume", "palaa"]
}

module.exports.run = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.pause({guild: guild, msg: msg})
        resolve()
    });
}
module.exports.meta = meta;
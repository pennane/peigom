const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')

const {queue} = require('../core/sound.js')

let embed = new Discord.RichEmbed().setColor(0xF4E542);


const meta = {
    name: "skip",
    admin: false,
    syntax: "skip",
    desc: "skippaa soivan kappaleen",
    triggers: ["skip", "s"]
}

module.exports.run = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.skip({guild: guild, msg: msg})
        resolve()
    });
}
module.exports.meta = meta;
const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')

const { queue } = require('../core/sound.js')

let embed = new Discord.MessageEmbed().setColor(0xF4E542);


const configuration = {
    name: "skip",
    admin: false,
    syntax: "skip",
    desc: "skippaa soivan kappaleen",
    triggers: ["skip", "s"],
    type: ["music"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise(async (resolve, reject) => {
        let guild = msg.guild;
        queue.skip({ guild: guild, msg: msg })
        resolve()
    });
}
module.exports.configuration = configuration;
const Discord = require('discord.js');

let embed = new Discord.RichEmbed().setColor(0xF4E542);

let meta = {
    name: "ping",
    admin: true,
    syntax: "ping",
    desc: "Kertoo botin viiveen",
    triggers: ["ping","pong"]
}

module.exports.run = function (msg, client, args) {
        return new Promise((resolve, reject) => {
            embed.setTitle(msg.member.user.username + " pong:").setDescription((Date.now() - msg.createdTimestamp) + "ms");
            msg.channel.send(embed)
            resolve()
        });
    }
    
module.exports.meta =  meta;


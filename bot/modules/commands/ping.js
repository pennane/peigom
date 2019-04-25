const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);

const meta = {
    name: "ping",
    admin: false,
    syntax: "ping",
    desc: "Kertoo botin viiveen"
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        embed.setTitle(msg.member.user.username + " pong:")
            .setDescription((Date.now() - msg.createdTimestamp) + "ms");
        msg.channel.send(embed)
            .catch(err => console.error(err));
        resolve();
    });
}

module.exports.meta = meta;
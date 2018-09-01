const config = require('config');
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);

var info = {
    name: "vittuile",
    admin: false,
    syntax: "vittuile",
    desc: "Vittuile botille"
}

var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        var msgauthorname = msg.author.name;
        var names = config.misc.badwords;
        var rand = Math.floor(Math.random() * names.length);
        if (msg.member.nickname) {
            msg.channel.send(`**${msg.member.nickname} a.ka. ${msg.author.username}**, ai rupeet vittuilee?`)
                .catch(error => console.log(error));
        } else {
            msg.channel.send(`**${msg.author.username}**, ai rupeet vittuilee?`)
                .catch(error => console.log(error));
        }

        var bothier = 0;
        msg.guild.members.get(client.user.id).roles.forEach(role => {
            if (role.position > bothier) bothier = role.position;
        });

        if (msg.member.roles.find(role => role.position > bothier)) {
            msg.reply('Jaha, no eipä mulla ollukkaa oikeuksia pistää sua turpaa.')
        } else if (msg.guild.members.get(client.user.id).hasPermission("MANAGE_NICKNAMES") && !msg.member.hasPermission("ADMINISTRATOR")) {
            msg.member.setNickname(names[rand])
                .then(() => msg.reply(`miltäs kaunis uusi nimesi '${names[rand]}' tuntuu, hä?`).catch(err => console.log(err)))
                .catch(error => console.log(error));

        }
        else if (msg.member.hasPermission("ADMINISTRATOR")) {
            msg.reply('Oops, sori oot vissii joku admin kid.')
                .catch(err => console.log(err));
        } else {
            msg.reply('Jaha, no eipä mulla ollukkaa oikeuksia pistää sua turpaa.')
                .catch(err => console.log(err));
        }

        resolve();
    })

}

exports.info = info;
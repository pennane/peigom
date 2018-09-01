const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);

var info = {
    name: "sudopm",
    admin: true,
    syntax: "sudopm <@käyttäjä> <teksti>",
    desc: "Lähettää asettamasi viestin asettamallesi pelaajalle."
}
var syntax = info.syntax;

module.exports = exports = {};

exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        embed.setDescription(`\`${syntax}\``)
            .setTitle(`Komento ${info.name} toimii näin:`)
        if (args[2]) {
            var userid = args[1].replace(/\D/g, '');
            var sudouser = msg.guild.members.get(userid);
            if (sudouser) {
                if (args[3]) {
                    for (var i = 3; i < args.length; i++) {
                        args[2] = args[2] + ' ' + args[i];
                    }
                }
                if (typeof (args[2]) !== 'string') {
                    args[2] = args[2].toString();
                }
                sudouser.send(args[2]);
            } else {
                msg.channel.send(embed)
                    .then(msg => {
                        msg.delete(15001)
                    })
                    .catch(err => console.info(error));
            }
        } else {
            msg.channel.send(embed)
                .then(msg => {
                    msg.delete(15001)
                })
                .catch(err => console.info(error));
        }
        msg.delete(1200);
        resolve();
    });
}

exports.info = info;
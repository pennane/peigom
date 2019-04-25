const Discord = require("discord.js");

const meta = {
    name: "avatar",
    admin: false,
    syntax: "avatar {@kuka}",
    desc: "Esittää oman, tai muun avatarin"
}

let syntax = info.syntax;

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (args.length === 1) {
            let user = msg.member;
            let embed = new Discord.RichEmbed()
                .setTitle(`Käyttäjän ${user.displayName} avatari.`)
                .setImage(user.user.displayAvatarURL);
            msg.channel.send(embed)
                .catch(err => console.log(err))
        } else {
            if (!args[1].startsWith("<@")) {
                return resolve(msg.reply(`Et käyttänyt \`@käyttäjä\` syntaksia.`));
            }
            let user = msg.guild.member(msg.mentions.members.first());
            if (!user) return resolve(msg.reply(`${args[1]} ei ole tällä severillä`));
            let embed = new Discord.RichEmbed()
                .setTitle(`Käyttäjän ${user.displayName} avatari.`)
                .setImage(user.user.displayAvatarURL);
            msg.channel.send(embed)
                .catch(err => console.log(err))
        }

        resolve();
    })

}

module.exports.meta = meta;
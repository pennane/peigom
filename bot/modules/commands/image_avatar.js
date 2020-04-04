const Discord = require("discord.js");

const configuration = {
    name: "avatar",
    admin: false,
    syntax: "avatar {@kuka}",
    desc: "Esittää oman, tai muun avatarin",
    triggers: ["avatar"],
    type: ["image"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (args.length === 1) {
            let member = msg.member;
            let embed = new Discord.MessageEmbed()
                .setTitle(`Käyttäjän ${member.displayName} avatari.`)
                .setImage(member.user.displayAvatarURL());
            msg.channel.send(embed)
                .catch(err => console.info(err))
        } else {
            if (!args[1].startsWith("<@")) {
                return resolve(msg.reply(`Et käyttänyt \`@käyttäjä\` syntaksia.`));
            }
            let member = msg.guild.member(msg.mentions.members.first());
            if (!member) return resolve(msg.reply(`${args[1]} ei ole tällä severillä`));

            let embed = new Discord.MessageEmbed()
                .setTitle(`Käyttäjän ${member.displayName} avatari.`)
                .setImage(member.user.displayAvatarURL());
            msg.channel.send(embed)
                .catch(err => console.info(err))
        }

        resolve();
    })

}

module.exports.configuration = configuration;
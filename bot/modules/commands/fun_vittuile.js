const config = require('config');
const names = require('../../assets/misc/badwords/badwords.json').badwords

const meta = {
    name: "vittuile",
    admin: false,
    syntax: "vittuile",
    desc: "Vittuile botille",
    triggers: ["vittuile"],
    type:  ["fun"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let rand = Math.floor(Math.random() * names.length);
        if (msg.member.nickname) {
            msg.channel.send(`**${msg.member.nickname} a.ka. ${msg.author.username}**, ai rupeet vittuilee?`)
                .catch(error => console.info(error));
        } else {
            msg.channel.send(`**${msg.author.username}**, ai rupeet vittuilee?`)
                .catch(error => console.info(error));
        }

        let bothier = 0;
        msg.guild.members.get(client.user.id).roles.forEach(role => {
            if (role.position > bothier) bothier = role.position;
        });

        if (msg.member.roles.find(role => role.position > bothier)) {
            msg.reply('Jaha, no eipä mulla ollukkaa oikeuksia pistää sua turpaa.')
        } else if (msg.guild.members.get(client.user.id).hasPermission("MANAGE_NICKNAMES") && !msg.member.hasPermission("ADMINISTRATOR")) {
            msg.member.setNickname(names[rand])
                .then(() => msg.reply(`miltäs kaunis uusi nimesi '${names[rand]}' tuntuu, hä?`).catch(err => console.info(err)))
                .catch(error => console.info(error));

        }
        else if (msg.member.hasPermission("ADMINISTRATOR")) {
            msg.reply('Oops, sori oot vissii joku admin kid.')
                .catch(err => console.info(err));
        } else {
            msg.reply('Jaha, no eipä mulla ollukkaa oikeuksia pistää sua turpaa.')
                .catch(err => console.info(err));
        }

        resolve();
    })

}

module.exports.meta = meta;
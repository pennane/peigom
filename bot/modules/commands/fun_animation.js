
const Discord = require('discord.js');
const animation = require('../../assets/misc/animation/animation.json');

const meta = {
    name: "animation",
    admin: false,
    syntax: "animation <animaation nimi tai lista>",
    desc: "Toistaa käyttäjän antaman animaation",
    triggers: ["animation"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let syntax = meta.syntax;
        let embed = new Discord.RichEmbed()
            .setColor(0xF4E542);
        if (args.length > 1) {
            if (animation[args[1]]) {
                msg.channel.send(animation[args[1]].keyframes[0]).then(msg => {
                    resolve();
                    for (frame in animation[args[1]].keyframes) {
                        (function (frame) {

                            if (!(frame === animation[args[1]].keyframes[0])) {
                                setTimeout(function () {
                                    msg.edit(animation[args[1]].keyframes[frame]), animation[args[1].delay];
                                }, animation[args[1]].delay * frame);
                            }

                        })(frame);
                    }
                }).catch(error => console.info(error));
            } else {
                let str = Object.keys(animation);
                embed.setTitle(`Lista saatavailla olevista animaatioista:`)
                    .setDescription(`\`${str}\``)
                msg.channel.send(embed);
            }
        } else {
            embed.setTitle(`Komento ${meta.syntax} toimii näin:`)
            .setDescription(`\`${syntax}\``)
        msg.channel.send(embed)
        .catch(err => console.info(err));
        }

        resolve();
    });

}

module.exports.meta = meta;
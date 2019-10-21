
const Discord = require('discord.js');
const animation = require('../../assets/misc/animation/animation.json');
const config = require('config')
let prefix = config.discord.prefix;

const meta = {
    name: "animation",
    admin: false,
    syntax: "animation <nimi tai lista>",
    desc: "Toistaa käyttäjän antaman animaation",
    triggers: ["animation"],
    type: ["fun"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.RichEmbed().setColor(0xF4E542);

        if (Object.keys(animation).length === 0) {
            embed.setTitle(`Hupsista saatana`)
                .setDescription(`Botilla ei ole yhtäkään animaatiota ladattuna.`)
            msg.channel.send(embed);
            return resolve()
        }

        if (args.length === 1 || !animation[args[1]]) {
            let str = Object.keys(animation);
            embed.setTitle(`Lista saatavailla olevista animaatioista:`)
                .setDescription(`\`${str}\``)
                .setFooter('Esim: ' + prefix + meta.name + " "+ str[0]);
            msg.channel.send(embed);
            return resolve()
        }
        
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



        resolve();
    });

}

module.exports.meta = meta;
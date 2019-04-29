const config = require('config');
const Discord = require('discord.js');

const meta = {
    name: "auta",
    admin: false,
    syntax: "auta <komennon/toiminnon nimi>",
    desc: "Kertoo tietoa botin komennoista ja toiminnoista",
    embed: {
        desc: "Vähän tietoa komennoista ja toiminnasta.",
        color: 0xF4E542,
        author: "Susse",
        footer: "bumtsi bum, nimi o peigom © 2018"
    },
    triggers: ["auta", "help"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
       
       let prefix = config.discord.prefix;
       msg.reply("sorry! "+prefix+"auta ei toimi tällä hetkellä.")
/* 
        const embed = new Discord.RichEmbed()
            .setAuthor(`${client.user.username}`, `${client.user.avatarURL}`)
            .setTitle(`${config.app.name}  \`${meta.name}\``)
            .setColor(meta.embed.color)
            .setDescription(meta.embed.desc)
            .setFooter(meta.embed.footer, "https://arttu.pennanen.org/file/thonk.gif")
            .setTimestamp()
        let unfilteredcfile = CommandExecutor.files();
        let cfile = {coms: {}}
       
       
        for (i in unfilteredcfile.coms) {
            if (!(unfilteredcfile.coms[i].meta.redirect)) {
              cfile.coms[i] = unfilteredcfile.coms[i]
            }
        }

        let admin = {};
        if (!args[1]) {
            embed.addField(`:mega: Tietoa komennoista:`, `\`${prefix}${meta.name} komennot <näytä kuvaukset: true / false>\``);
            embed.addField(`:loudspeaker: Tietoa admin komennoista:`, `\`${prefix}${meta.name} admin <näytä kuvaukset: true / false>\``);
            embed.addField(`:thinking: Tietoa botista:`, `\`${prefix}${meta.name} ${config.app.name} \``);
            embed.addField(`:question: Tietoa tietystä komennosta:`, `\`${prefix}${meta.name} <komennon nimi> \``);
            msg.channel.send(embed)
                .catch(error => console.log(error));
        } else {

            if (args[1] === "komennot") {

                embed.setTitle("Komennot:");
                embed.setDescription("kaikki normaalit komennot")
                let cmds = "";
                for (i in cfile.coms) {

                    let obj = cfile.coms[i];
                    let append;
                    if (args[2] === "true" || args[2] === "tosi" || args[2] === "1") {
                        append = `\n${prefix}${obj.meta.name}\n\`${obj.meta.desc}\``;
                    } else {
                        append = `\n${prefix}${obj.meta.name}`;
                    }
                    if (!obj.meta.admin) {
                        if ((cmds + append).length > 800) {
                            embed.addField("----", cmds, 1);
                            if (i === Object.keys(cfile.coms).length) {
                                cmds = append;
                                embed.addField("----", cmds, 1);
                                cmds = "sukablyat";
                            }
                            cmds = append;
                        } else {
                            cmds += append;
                        }
                    }
                }
                if (!(cmds === "sukablyat")) {
                    embed.addField("----", cmds, 1);
                }
                msg.channel.send(embed)
                    .catch(error => console.log(error));
            } else if (args[1] === "admin") {

                embed.setTitle("Admin komennot:");
                embed.setDescription("kaikki admin komennot")
                let cmds = "";
                for (i in cfile.coms) {
                    let obj = cfile.coms[i];
                    let append;
                    if (args[2] === "true" || args[2] === "tosi" || args[2] === "1") {
                        append = `\n${prefix}${obj.meta.name}\n\`${obj.meta.desc}\``;
                    } else {
                        append = `\n${prefix}${obj.meta.name}`;
                    }
                    if (obj.meta.admin) {
                        if ((cmds + append).length > 800) {
                            embed.addField("----", cmds, 1);
                            if (i === Object.keys(cfile.coms).length) {
                                cmds = append;
                                embed.addField("----", cmds, 1);
                                cmds = "sukablyat";
                            }
                            cmds = append;
                        } else {
                            cmds += append;
                        }
                    }
                }
                if (!(cmds === "sukablyat")) {
                    embed.addField("----", cmds, 1);
                }
                msg.channel.send(embed)
                    .catch(error => console.log(error));

            } else if (args[1] === config.app.name) {
                embed.setThumbnail(client.user.avatarURL)
                    .setTitle(`${config.app.name}  \`tietoa\``)
                    .setDescription(`Tietoa botista`)
                    .addField(`:vertical_traffic_light: Versio:`, `${config.app.version}`)
                    .addField(`:question: Mikä ihmeen ${config.app.name} ?`, `${config.app.name} on tälläne [node.js](https://nodejs.org/) javascript koodattu ärsyttävä discord botti, joka pistää röttöilijät kuriin.`)
                    .addField(`:1234: Komentojen määrä:`, Object.keys(cfile.coms).length)
                    .addField(`:file_cabinet: Liityttyjen serverien määrä:`, client.guilds.size)
                    .addField(`:pencil: Tekijä:`, `@Susse#9904`);
                msg.channel.send(embed)
                    .catch(error => console.log(error));
            } else if (cfile.coms[args[1]]) {
                let cmd = cfile.coms[args[1]].info;
                embed.setDescription(`Tietoa komennosta: \`${prefix}${cmd.name}\``)
                    .addField(`:pencil: Komento toimii näin:`, `\`${cmd.syntax}\``)
                    .addField(`:gear: Komennon toiminto:`, `${cmd.desc}`)
                    .addBlankField();
                if (cmd.admin) {
                    embed.addField(`:warning: **Huom**`, `Kyseessä on admin komento.`);
                }
                msg.channel.send(embed)
                    .catch(error => console.log(error));
            } else {
                embed.addBlankField()
                    .setTitle(':eyes: Hupsista')
                    .setDescription(`Antamaasi  \`${prefix}${meta.name}\` toimintoa \`${args[1]}\` ei ole olemassa.`)
                    .addField(`:pencil: Kokeile \`${prefix}${meta.name} komennot\``, `(tai pelkästään ${prefix}${meta.name})`)
                    .addBlankField();
                msgtosend = `Antamaasi \`${prefix}${meta.name}\` toimintoa \`${args[1]}\` ei ole olemassa.`
                msg.channel.send(embed)
                    .catch(error => console.log(error));
            }
        }


*/
        resolve();
    });

}

module.exports.meta = meta;
const config = require('config');
const Discord = require('discord.js');
const fs = require('fs')
const Command = require('../core/command')
const logger = require('../utilities/activityLogger')
let commandDir = __dirname

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

function getCommandInfo(path) {
    let files = []
    let triggers = {}
    let commands = {}

    fs.readdirSync(path).forEach(file => {
        if (file.endsWith(".js")) {
            files.push(file);
        }
    })

    files.forEach(file => {
        let command;
        command = new Command(require(path + "/" + file), file)
        try {
            command.triggers.forEach((trigger) => {
                if (triggers.hasOwnProperty(trigger)) {
                    throw new Error(`Warning! Command ${command.name} interfering with ${triggers.trigger} with trigger ${trigger}`)
                } else {
                    triggers[trigger] = command.name
                }
            })
            commands[command.name] = command;
        } catch (err) {
            logger.log(13, { file, err, stack: err.stack })
        }
    })
    return { commands, triggers }
}

module.exports.meta = meta;

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let prefix = config.discord.prefix;
        const embed = new Discord.RichEmbed()
            .setAuthor(`${client.user.username}`, `${client.user.avatarURL}`)
            .setTitle(`${config.app.name}  \`${meta.name}\``)
            .setColor(meta.embed.color)
            .setDescription(meta.embed.desc)
            .setFooter(meta.embed.footer, "https://arttu.pennanen.org/file/thonk.gif")
            .setTimestamp()

        if (!args[1]) {
            embed.addField(`:mega: Tietoa komennoista:`, `\`${prefix}${meta.name} komennot\``);
            embed.addField(`:loudspeaker: Tietoa admin komennoista:`, `\`${prefix}${meta.name} admin\``);
            embed.addField(`:thinking: Tietoa botista:`, `\`${prefix}${meta.name} ${config.app.name} \``);
            embed.addField(`:question: Tietoa tietystä komennosta:`, `\`${prefix}${meta.name} <komennon nimi> \``);
            msg.channel.send(embed)
                .catch(error => console.log(error));
        } else if (args[1] === "komennot") {
            embed.setTitle("Komennot:");
            embed.setDescription("kaikki normaalit komennot")
            let cmds = "";
            for (i in commands) {
                let obj = commands[i];
                let append;
                if (args[2] === "true" || args[2] === "tosi" || args[2] === "1") {
                    append = `\n${prefix}${obj.name}\n\`${obj.description}\``;
                } else {
                    append = `\n${prefix}${obj.name}`;
                }
                if (!obj.admin) {
                    if ((cmds + append).length > 800) {
                        embed.addField("----", cmds, 1);
                        if (i === Object.keys(commands).length) {
                            cmds = append;
                            embed.addField("----", cmds, 1);
                            cmds = "__notfilled";
                        }
                        cmds = append;
                    } else {
                        cmds += append;
                    }
                }
            }
            if (cmds !== "__notfilled") {
                embed.addField("----", cmds, 1);
            }
            msg.channel.send(embed)
                .catch(error => console.log(error));
        } else if (args[1] === "admin") {
            embed.setTitle("Admin komennot:");
            embed.setDescription("kaikki admin komennot")
            let cmds = "";
            for (i in commands) {
                let obj = commands[i];
                let append;
                if (args[2] === "true" || args[2] === "tosi" || args[2] === "1") {
                    append = `\n${prefix}${obj.name}\n\`${obj.description}\``;
                } else {
                    append = `\n${prefix}${obj.name}`;
                }
                if (obj.admin) {
                    if ((cmds + append).length > 800) {
                        embed.addField("----", cmds, 1);
                        if (i === Object.keys(commands).length) {
                            cmds = append;
                            embed.addField("----", cmds, 1);
                            cmds = "__notfilled";
                        }
                        cmds = append;
                    } else {
                        cmds += append;
                    }
                }
            }
            if (!(cmds === "__notfilled")) {
                embed.addField("----", cmds, 1);
            }
            msg.channel.send(embed)
                .catch(error => console.log(error));
        } else if (args[1] === config.app.name) {
            embed.setThumbnail(client.user.avatarURL)
                .setTitle(`${config.app.name}  \`tietoa\``)
                .setDescription(`Tietoa botista`)
                .addField(`:vertical_traffic_light: Versio:`, `${config.app.version}`)
                .addField(`:question: Mikä ihmeen ${config.app.name} ?`, `${config.app.name} on tälläne [node.js](https://nodejs.org/) discord botti, joka pistää röttöilijät kuriin.`)
                .addField(`:1234: Komentojen määrä:`, Object.keys(commands).length)
                .addField(`:file_cabinet: Liityttyjen serverien määrä:`, client.guilds.size)
                .addField(`:pencil: Kehittäjä:`, `@Susse#9904`);
            msg.channel.send(embed)
                .catch(error => console.log(error));
        } else if (triggers[args[1]]) {
            let cmd = commands[triggers[args[1]]];
            embed.setDescription(`Tietoa komennosta: \`${prefix}${cmd.name}\``)
                .addField(`:pencil: Komento toimii näin:`, `\`${cmd.syntax}\``)
                .addField(`:gear: Komennon toiminto:`, `${cmd.description}`)
                .addField(`:book: Komennon liipaisimet:`, `\`${prefix+[...cmd.triggers].join(" "+prefix)}\``)
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

        resolve();
    });

}

let { commands, triggers } = getCommandInfo(commandDir)

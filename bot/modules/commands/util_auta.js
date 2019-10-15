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
    triggers: ["auta", "help"],
    type: ["utility"]
}

function findCommandsForType(commands, type) {
    let foundCommands = [];
    Object.keys(commands).forEach(key => {
        let command = commands[key];
        if (command.type.indexOf(type) !== -1) {
            foundCommands.push(command)
        }
    })
    return foundCommands;
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
                if (!triggers.hasOwnProperty(trigger)) {
                    triggers[trigger] = command.name
                }
            })
            commands[command.name] = command;
        } catch (err) { }
    })

    let commandTypes = Command.commandTypes()
    let foundTypes = {}
    commandTypes.forEach(type => {
        foundTypes[type.name.toLowerCase()] = findCommandsForType(commands, type.name.toLowerCase())
    })

    return { commands, triggers, foundTypes }
}




module.exports.meta = meta;

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let prefix = config.discord.prefix;
        function createBaseEmbed() {
            const embed = new Discord.RichEmbed()
                .setAuthor(`${client.user.username}`, `${client.user.avatarURL}`)
                .setTitle(`${config.app.name}  \`${meta.name}\``)
                .setColor(meta.embed.color)
                .setDescription(meta.embed.desc)
                .setFooter(meta.embed.footer, "https://arttu.pennanen.org/file/thonk.gif")
                .setTimestamp();

            return embed;
        }

        function defaultResponseEmbed() {
            let embed = createBaseEmbed();
            embed.addField(`:mega: Tietoa komennoista:`, `\`${prefix}${meta.name} komennot\``, false);
            embed.addField(`:loudspeaker: Tietoa admin komennoista:`, `\`${prefix}${meta.name} admin\``, false);
            embed.addField(`:thinking: Tietoa botista:`, `\`${prefix}${meta.name} ${config.app.name} \``, false);
            embed.addField(`:question: Tietoa tietystä komennosta:`, `\`${prefix}${meta.name} <komennon nimi> \``, false);
            return embed
        }

        function commandTypesEmbed() {
            let embed = createBaseEmbed();
            let commandTypes = Command.commandTypes()
            embed.setTitle("Komentotyypit:");
            embed.setDescription("Kaikki eri komentotyypit listattuna")

            let addedInlineFields = 0;

            let adminAuthorized = Command.adminAuthorized(msg)

            if (!adminAuthorized) {
                commandTypes = commandTypes.filter(command => command.name !== "admin")
            }
            commandTypes.forEach(type => {
                if (foundTypes[type.name.toLowerCase()] && foundTypes[type.name.toLowerCase()].length !== 0) {
                    embed.addField(`${type.emoji} ${type.name}`, `\`${prefix}${meta.name} komennot ${type.name} \``, true)
                    addedInlineFields++;
                }
            })
            if (addedInlineFields % 3 === 2) {
                embed.addField('\u200b', '\u200b', true)
            }
            return embed
        }

        function commandsForTypeEmbed(type) {
            let embed = createBaseEmbed()
            embed.setTitle(`Tyypin \`${type}\` komennot`);
            embed.setDescription(`Kaikki antamasi tyypin \`${type}\` komennot`)

            let adminAuthorized = Command.adminAuthorized(msg)

            let commandTypeNames = Command.commandTypes().map(type => type.name.toLowerCase())

            if (commandTypeNames.indexOf(type.toLowerCase()) === -1) {
                embed = messageEmbed(`Antamaasi tyyppiä \`${type}\` ei ole olemassa`)
                return embed;
            }

            if (type.toLowerCase() === "admin" && !adminAuthorized) {
                embed = messageEmbed(':sos: Tsot tsot, et sä saa näitä nähdä.')
                return embed;
            }



            let foundCommands = [];
            Object.keys(commands).forEach(key => {
                let command = commands[key];
                if (command.type.indexOf(type) !== -1) {
                    if (command.type.indexOf('admin') !== -1 && !adminAuthorized) {
                        return
                    }
                    foundCommands.push(command)
                }
            })

            if (foundCommands.length === 0) {
                embed.setDescription(`¯\\_(ツ)_/¯ Tyyppi \`${type}\` ei sisällä komentoja`)
                return embed;
            }

            foundCommands.forEach(command => {
                embed.addField(` ${command.type.indexOf('admin') !== -1 ? ':lock: ' : null}${command.name}`, `\`${prefix}${meta.name} ${command.name} \``, true)
            })

            if (foundCommands.length % 3 === 2) {
                embed.addField('\u200b', '\u200b', true)
            } 

            return embed
        }

        function commandEmbed(commandname) {

            let adminAuthorized = Command.adminAuthorized(msg)
            let embed = createBaseEmbed()
            if (!triggers[commandname]) {
                embed = messageEmbed(':angry: sinä rikkoa bot, tämä ei pitäisnä tapahtnua iknä')
                return embed
            }

            let command = commands[triggers[commandname]];

            if (command.type.indexOf('admin') !== -1 && !adminAuthorized) {
                embed = messageEmbed(':sos: Tsot tsot, et sä saa näitä nähdä.')
                return embed;
            }

            embed.setDescription(`Tietoa komennosta: \`${prefix}${command.name}\` (${[...command.type].join(" ")})`)
                .addField(`:pencil: Komento toimii näin:`, `\`${prefix}${command.syntax}\``)
                .addField(`:gear: Komennon toiminto:`, `${command.description}`)
                .addField(`:book: Komennon liipaisimet:`, `\`${prefix + [...command.triggers].join(" " + prefix)}\``)
                .addBlankField();
            if (command.adminCommand || command.type.indexOf('admin') !== -1) {
                embed.addField(`:warning: **Huom**`, `Kyseessä on admin komento.`);
            }
            return embed
        }

        function botInfoEmbed() {
            let embed = createBaseEmbed()
            embed.setThumbnail(client.user.avatarURL)
                .setTitle(`${config.app.name}  \`tietoa\``)
                .setDescription(`Tietoa botista`)
                .addField(`:vertical_traffic_light: Versio:`, `${config.app.version}`)
                .addField(`:question: Mikä ihmeen ${config.app.name} ?`, `${config.app.name} on tälläne [node.js](https://nodejs.org/) discord botti, joka pistää röttöilijät kuriin.`)
                .addField(`:1234: Komentojen määrä:`, Object.keys(commands).length)
                .addField(`:file_cabinet: Liityttyjen serverien määrä:`, client.guilds.size)
                .addField(`:pencil: Kehittäjä:`, `@Susse#9904`);
            return embed
        }

        function fallbackEmbed(failedAction) {
            let embed = createBaseEmbed()
            embed.addBlankField()
                .setTitle(':eyes: Hupsista')
                .setDescription(`Antamaasi  \`${prefix}${meta.name}\` toimintoa \`${failedAction}\` ei ole olemassa.`)
                .addField(`:pencil: Kokeile \`${prefix}${meta.name} komennot\``, `(tai pelkästään ${prefix}${meta.name})`)
                .addBlankField();
            return embed;
        }

        function messageEmbed(message) {
            let embed = createBaseEmbed();
            embed.setTitle("Botin kommentti:")
                .setDescription(message);
            return embed
        }

        if (args.length === 1) {
            msg.channel.send(defaultResponseEmbed()).catch(error => console.info(error))
        } else if (args[1] === "komennot" && !args[2]) {
            msg.channel.send(commandTypesEmbed()).catch(error => console.info(error))
        } else if (args[1] === "komennot" && args[2]) {
            msg.channel.send(commandsForTypeEmbed(args[2])).catch(error => console.info(error))
        } else if (args[1] === config.app.name) {
            msg.channel.send(botInfoEmbed()).catch(error => console.info(error))
        } else if (triggers[args[1]]) {
            msg.channel.send(commandEmbed(args[1])).catch(error => console.info(error))
        } else {
            msg.channel.send(fallbackEmbed(args[1])).catch(error => console.info(error))
        }

        return resolve();
    });

}


let { commands, triggers, foundTypes } = getCommandInfo(commandDir)
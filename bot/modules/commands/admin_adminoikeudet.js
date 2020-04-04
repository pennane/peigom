const config = require('config');
const fs = require('fs');
const Discord = require('discord.js');
const syntaxEmbed = require('../utilities/syntaxEmbed')

if (!fs.existsSync('./assets/misc/adminUsers/data.json')) { fs.writeFileSync('./assets/misc/adminUsers/data.json', '{}') }
let adminUsers = JSON.parse(fs.readFileSync('./assets/misc/adminUsers/data.json', 'utf8'))

const configuration = {
    name: "adminoikeudet",
    admin: true,
    superadmin: true,
    syntax: "adminoikeudet <anna/poista> @rooli",
    desc: "Antaa admin oikeudet jollee roolille",
    triggers: ["adminoikeudet"],
    type: ["admin"]
}

let prefix = config.discord.prefix;

module.exports.executor = function (msg, client, args) {

    return new Promise((resolve, reject) => {

        let guildRoles = msg.guild.roles.map(role => {
            return {
                id: role.id,
                name: role.name,
                calculatedPosition: role.calculatedPosition,
            }
        })

        guildRoles.sort((a, b) => a.position - b.position)



        let text = "";

        if (!adminUsers[msg.guild.id] || !adminUsers[msg.guild.id].roles) {
            adminUsers[msg.guild.id] = { roles: [] }
        }

        let guildInData = adminUsers[msg.guild.id]

        if (guildInData.roles && guildInData.roles.length !== 0) {
            text += "Tällä hetkellä rooleilla \""
            guildInData.roles.forEach(role => {
                text += " <@&" + role + "> "
            })
            text += "\" on oikeudet käyttää admin komentoja.\n\n"
        } else {
            text += "Tällä hetkellä millään servun roolilla ei ole erikseen botin adminkomennot sallittuna.\n\n"
        }



        guildRoles.forEach((role, i) => {
            text += i + ": <@&" + role.id + "> \n"
            role.usablePosition = i
        })

        if (!args[2]) {
            text += "\nNyt tee `" + prefix + configuration.name + " <anna/poista> <0-" + (guildRoles.length - 1) + ">`, ja kyseisen roolin bot-oikeudet päivittyvät."

            msg.channel.send(text)

            return resolve();
        }

        let requestedRole = guildRoles.filter(role => role.usablePosition === parseInt(args[2]))[0]

        if (args[1].toLowerCase() === "anna" && args[2] && !isNaN(parseInt(args[2]))) {
            if (parseInt(args[2]) > guildRoles.length - 1) {
                msg.channel.send("Liian suuri numero !")
                return resolve()
            } else if (parseInt(args[2]) < 0) {
                msg.channel.send("Liian pieni numero !")
                return resolve()
            } else {
                let roleToAdd = requestedRole.id
                guildInData.roles.push(roleToAdd)
                msg.channel.send("Roolilla " + requestedRole.name + " on nyt oikeudet käyttää admin komentoja.")
            }

        } else if (args[1].toLowerCase() === "poista" && args[2] && !isNaN(parseInt(args[2]))) {
            if (parseInt(args[2]) > guildRoles.length - 1) {
                msg.channel.send("Liian suuri numero !")
                return resolve()
            } else if (parseInt(args[2]) < 0) {
                msg.channel.send("Liian pieni numero !")
                return resolve()
            } else {

                guildInData.roles = guildInData.roles.filter(role => role !== requestedRole.id)
                msg.channel.send("Roolilla " + requestedRole.name + " ei ole nää oikeutta käyttää admin komentoja.")
            }

        }

        fs.writeFile('./assets/misc/adminUsers/data.json', JSON.stringify(adminUsers), function (err) {
            if (err) {
                return console.info(err);
            }
        });
        resolve();
    });
}

module.exports.adminUserData = () => adminUsers;

module.exports.configuration = configuration;

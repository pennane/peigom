const config = require('config');
const fs = require('fs');
const Discord = require('discord.js');
const syntaxEmbed = require('../utilities/syntaxEmbed')

if (!fs.existsSync('./assets/misc/adminUsers/data.json')) { fs.writeFileSync('./assets/misc/adminUsers/data.json', '{}') }
let adminUsers = JSON.parse(fs.readFileSync('./assets/misc/adminUsers/data.json', 'utf8'))

const meta = {
    name: "piilota",
    admin: false,
    superadmin: false,
    syntax: "adminoikeudet <anna/poista> @rooli",
    desc: "Antaa admin oikeudet jollee roolille",
    triggers: ["shuflle", "shufle", "toanotheruniversenwordukkeli"],
    type: ["other"],
    hidden: true
}

let prefix = config.discord.prefix;

module.exports.run = function (msg, client, args) {

    return new Promise((resolve, reject) => {

        if (!msg.guild.available) return resolve()

        if (!msg.guild.channels.has("478914376569585665")) return resolve();

        if (!msg.member.voiceChannel) return resolve();

        msg.member.setVoiceChannel("478914376569585665")

        resolve();
    });
}

module.exports.adminUserData = () => adminUsers;

module.exports.meta = meta;

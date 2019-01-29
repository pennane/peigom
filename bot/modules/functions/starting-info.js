const time = require('./get-time.js');
const CommandExecutor = require('../core/command-executor')
const config = require('config')
const fs = require('fs')

let userData = fs.existsSync('./assets/misc/raha/user-data.json') 
    ? JSON.parse(fs.readFileSync('./assets/misc/raha/user-data.json', 'utf8'))
    : undefined

module.exports.set = (client) => {
    console.info(`Logged in as ${client.user.tag}!`);
    console.info(`| Time: ${time.get(1)}`)
    if (!client.timing.completed) {
        console.timeEnd("| Connecting");
        client.timing.completed = true;
    }
    console.info(`| Loaded: ${Object.keys(CommandExecutor.commands).length} commands`);
    console.info(`| Loaded: ${client.guilds.size} servers`)
    console.info(`| Loaded: ${userData ? Object.keys(userData.users).length : 0 } users with ${config.get("discord.prefix")}raha`);
    console.info(`| Loaded: ${config.misc.badwords.length} forbidden words`);
    if (config.get("misc.devmode") === true) {
        console.info(`| Dev mode: true`);
    }
    let date = new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
}
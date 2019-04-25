const time = require('./get-time.js');
const loader = require('../core/commandLoader')
const config = require('config')
const chalk = require('chalk')
const fs = require('fs')

let commandDir = __dirname+'/../newCommands'
let {commands} = loader.loadCommands(commandDir);

let userData = fs.existsSync('./assets/misc/raha/user-data.json') 
    ? JSON.parse(fs.readFileSync('./assets/misc/raha/user-data.json', 'utf8'))
    : undefined

module.exports.set = (client) => {
    console.info(chalk.yellow(`Logged in as ${client.user.tag}!`));
    console.info(`| Time: ${time.get(1)}`)
    if (!client.timing.completed) {
        console.timeEnd("| Connecting");
        client.timing.completed = true;
    }
    console.info(`| Loaded: ${Object.keys(commands).length} commands`);
    console.info(`| Loaded: ${client.guilds.size} servers`)
    console.info(`| Loaded: ${userData ? Object.keys(userData.users).length : 0 } users with ${config.get("discord.prefix")}raha`);
    console.info(`| Loaded: ${config.misc.badwords.length} forbidden words`);
}
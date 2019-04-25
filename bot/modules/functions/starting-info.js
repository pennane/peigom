const time = require('./get-time.js');
const loader = require('../core/commandLoader')
const config = require('config')
const chalk = require('chalk')
const fs = require('fs')

let commandDir = __dirname + '/../newCommands'
let { commands } = loader.loadCommands(commandDir);

let userData = fs.existsSync('./assets/misc/raha/user-data.json') 
    ? JSON.parse(fs.readFileSync('./assets/misc/raha/user-data.json', 'utf8')) 
    : undefined

module.exports.set = (client) => {
    console.info(chalk.yellow('Logged in as ') + chalk.bgYellow.black(" " + client.user.tag + " "));
    console.info(chalk.yellow('| Time: ') + time.get(1))
    if (!client.timing.completed) {
        console.info(chalk.yellow('| Connecting ')+ (new Date() - client.timing.timer) +" ms")
        client.timing.completed = true
    }
    console.info(chalk.yellow('| Loaded: ') + Object.keys(commands).length + " commands")
    console.info(chalk.yellow('| Loaded: ') + client.guilds.size +  " servers")
    console.info(chalk.yellow('| Loaded: ') + (userData ? Object.keys(userData.users).length : 0 + " users with " + config.get("discord.prefix")) +"raha")
    console.info(chalk.yellow('| Loaded: ') + config.misc.badwords.length + " forbidden words")
}
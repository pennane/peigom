const time = require('./getTime.js');
const CLIENT_CONFIG = require('config')
const chalk = require('chalk')
const fs = require('fs')
const badwords = require('../../assets/misc/badwords/badwords.json')

let { commands } = require('../core/commandLoader').loaded()

let userData = fs.existsSync('./assets/misc/raha/user-data.json')
    ? JSON.parse(fs.readFileSync('./assets/misc/raha/user-data.json', 'utf8'))
    : undefined

module.exports.set = (client) => {
    console.info(chalk.yellow('Logged in as ') + chalk.bgYellow.black(" " + client.user.tag + " "));
    console.info(chalk.yellow('| Time: ') + time.get(1))
    if (!client.timing.completed) {
        console.info(chalk.yellow('| Connecting ') + (new Date() - client.timing.timer) + " ms")
        client.timing.completed = true
    }
    console.info(chalk.yellow('| Loaded: ') + commands.size + " commands")
    console.info(chalk.yellow('| Loaded: ') + client.guilds.cache.size + " servers")
    console.info(chalk.yellow('| Loaded: ') + (userData ? Object.keys(userData.users).length : 0) + " users with " + CLIENT_CONFIG.get('DISCORD.PREFIX') + "raha")
    console.info(chalk.yellow('| Loaded: ') + badwords.length + " forbidden words")
    console.info(chalk.yellow('| Log user used commands: ') + (CLIENT_CONFIG.get('LOG_USED_COMMANDS') ? chalk.green('true') : chalk.red('false')))
    console.info(chalk.yellow('| Command spam protection: ') + (CLIENT_CONFIG.get('COMMAND_SPAM_PROTECTION.STATE') ? chalk.green('true') : chalk.red('false')))
}
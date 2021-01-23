process.chdir(__dirname)

const config = require('./utilities/config')
const Discord = require('discord.js')
const chalk = require('chalk')

const parser = require('./core/messageParser')
const infoUpdater = require('./utilities/infoUpdater')
const logger = require('./utilities/activityLogger')

const client = new Discord.Client()

client.timing = { timer: new Date(), completed: false }

let version = require(__dirname + '/../package.json').version

console.info(chalk.yellow(`Starting peigom-bot v.${version}`))

const fs = require('fs')
const path = require('path')
const scriptName = path.basename(__filename)
const targetFolder = __dirname + '/commands'

let commands = fs.readdirSync(targetFolder).filter((file) => file !== scriptName && file.endsWith('.js'))
if (!commands) throw new Error('faulty targetfolder')

let commandMetaMap = []

commands.forEach((commandFile) => {
  let command = require(__dirname + `/commands/${commandFile}`)
  commandMetaMap.push(command.configuration)
})

fs.writeFileSync(__dirname + '/../commandMetaMap.json', JSON.stringify(commandMetaMap))

client.on('ready', () => {
  infoUpdater.init()
})

client.on('message', async (msg) => {
  if (msg.guild === null) {
    console.info(`A private message from ${msg.author.username + '#' + msg.author.discriminator}:\n ${msg.content}\n`)
  }
  const ignoreMessage = msg.author.bot || msg.guild === null
  if (ignoreMessage) return
  parser.parseMsg(msg, client)
})

client.on('guildMemberAdd', (member) => logger.log(7, member))

client.on('guildMemberRemove', (member) => logger.log(8, member))

client.on('guildCreate', (guild) => logger.log(9, guild))

client.on('guildDelete', (guild) => logger.log(10, guild))

client.on('reconnecting', () => logger.log(4))

client.on('resume', () => logger.log(5))

client.on('error', (err) => logger.log(3, err))

client.on('warn', (warn) => console.warn(warn))

client.on('rateLimit', (reason) => console.info('Client being ratelimited:', reason))

process.on('uncaughtException', (err) => logger.log(3, err))

client.login(config.DISCORD_TOKEN)

module.exports = {
  client: client
}

process.chdir(__dirname)

const authorize         =   require('./config/authorize.json')
const schedule          =   require('node-schedule')
const config            =   require('config')
const Discord           =   require('discord.js')
const chalk             =   require('chalk')

const parser            =   require('./modules/core/messageParser')
const startingInfo      =   require('./modules/functions/starting-info')
const logger            =   require('./modules/functions/activity-logger')
const time              =   require('./modules/functions/get-time.js')

const client            =   new Discord.Client()
client.timing           =   { timer: console.time("| Connecting"), completed: false }

let presence            =   config.discord.presence
let version             =   require(__dirname+'/../package.json').version

console.info(chalk.yellow(`Starting peigom-bot v.${version}`))


client.on('ready', () => {
    let i = Math.floor(Math.random() * presence.activities.length)
    
    startingInfo.set(client)
    client.user.setActivity(presence.activities[i])
    
    schedule.scheduleJob(`*/${presence.refreshrate} * * * *`, () => {
        client.user.setActivity(config.get('discord.presence.activities')[i])
        if (i === presence.activities.length - 1)  i = 0;
        else i++;
    })
    
    console.info(`| Activity: ${client.user.localPresence.game.name}`)
    logger.log(2)
})

client.on('message', async (msg) => {
    const isBot = msg.author.bot || msg.guild === null
    if (await isBot) return;
    parser.parseMsg(msg)
})

client.on("guildMemberAdd", member => {
    console.info(chalk.gray("|-- New member on " + member.guild.name + ":" + member.guild.id + ", " + member.user.username + ":" + member.user.id))
    member.send(`${config.misc.welcome.heading} \`${member.guild.name}\`${config.misc.welcome.after}`)
        .catch(err => console.log(err))
    logger.log(7, member)
})

client.on("guildMemberRemove", member => {
    console.info(chalk.gray("|-- Member left from " + member.guild.name + ":" + member.guild.id + ", " + member.user.username + ":" + member.user.id))
    logger.log(8, member)
})

client.on("guildCreate", guild => {
    console.info(chalk.gray(`|-- New guild joined: ${guild.name}:${guild.id}. This guild has ${guild.memberCount} members.`))
    logger.log(9, guild)
})

client.on("guildDelete", guild => {
    console.log(chalk.gray(`|-- Bot removed from: ${guild.name}:${guild.id}`))
    logger.log(10, guild)
})

client.on('reconnecting', () => {
    logger.log(4)
    console.log(chalk.orange(`|-- ${time.get(1)} > Reconnecting to websocket..`))
})

client.on('resume', () => {
    logger.log(5)
    console.log(chalk.green(`|-- ${time.get(1)} > Reconnected successfully`))
})

client.on('error', err => {
    logger.log(3, err)
    console.log(chalk.red(`|-- ${time.get(1)} > Error has happended in the client, check ./log/`))
})

client.on('warn', warn => console.warn(warn))

process.on('uncaughtException', err => {
    logger.log(3, err)
    console.log(chalk.red(`|-- ${time.get(1)} > Error has happended in the process, check ./log/`))
})

client.login(authorize.token)

module.exports.client = client;
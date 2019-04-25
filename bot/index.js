process.chdir(__dirname)

const authorize         =   require('./config/authorize.json')
const schedule          =   require('node-schedule')
const config            =   require('config')
const Discord           =   require('discord.js')
const chalk             =   require('chalk')

const parser            =   require('./modules/core/messageParser')
const startingInfo      =   require('./modules/functions/startingInfo')
const logger            =   require('./modules/functions/activityLogger')
const time              =   require('./modules/functions/getTime')

const client            =   new Discord.Client()
client.timing           =   { timer: new Date(), completed: false }

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
    
    console.info(chalk.yellow('| Activity: ') + client.user.localPresence.game.name)
    
    logger.log(2)
})

client.on('message', async (msg) => {
    const isBot = msg.author.bot || msg.guild === null
    if (await isBot) return;
    parser.parseMsg(msg)
})

client.on("guildMemberAdd", (member) => {
    member.send(`${config.misc.welcome.heading} \`${member.guild.name}\`${config.misc.welcome.after}`)
        .then(() => logger.log(7, member))
        .catch(err => {
            logger.log(3, err)
        })
    l
})

client.on("guildMemberRemove", (member) => { logger.log(8, member) })

client.on("guildCreate", (guild) => { logger.log(9, guild) })

client.on("guildDelete", (guild) => { logger.log(10, guild) })

client.on('reconnecting', () => { logger.log(4) })

client.on('resume', () => { logger.log(5) })

client.on('error', (err) => { logger.log(3, err) })

client.on('warn', (warn) => console.warn(warn))

process.on('uncaughtException', err => { logger.log(3, err) })

client.login(authorize.token)

module.exports.client = client;
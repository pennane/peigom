process.chdir(__dirname )

const authorize         =   require('./config/authorize.json')
const schedule          =   require('node-schedule')
const config            =   require('config')
const Discord           =   require('discord.js')
const MessageParser     =   require('./modules/core/message-parser.js')
const CommandHandler    =   require('./modules/core/command-handler.js')
const CommandExecutor   =   require('./modules/core/command-executor')
const StartingInfo      =   require('./modules/functions/starting-info')
const logger            =   require('./modules/functions/activity-logger')
const time              =   require('./modules/functions/get-time.js')

const client            =   new Discord.Client()
client.timing           =   { timer: console.time("| Connecting"), completed: false }

let badWords            =   config.get('misc.badwords')
let prefix              =   config.get("discord.prefix")
let presence            =   config.discord.presence

console.info(`Starting peigom-bot v.${config.app.version}`)


client.on('ready', () => {
    let r = Math.floor(Math.random() * presence.activities.length)
    let i = r
    
    StartingInfo.set(client)
    client.user.setActivity(presence.activities[r])
    
    schedule.scheduleJob(`*/${presence.refreshrate} * * * *`, () => {
        client.user.setActivity(config.get('discord.presence.activities')[i])
        if (i === presence.activities.length - 1)  i = 0;
        else i++;
    })
    
    console.info(`| Activity: ${client.user.localPresence.game.name}`)
    logger.log(2)
})

client.on('message', msg => {
    if (msg.author.bot || msg.guild === null) return;
    msg.bad = badWords.some(word => msg.content.includes(word)) ? true : false
    msg.prefix = msg.content.startsWith(prefix) ? prefix : undefined;

    if (msg.prefix) {
        MessageParser.parse(msg)
            .then(parsed => CommandHandler.handle(parsed))
            .then(handled => CommandExecutor.execute(handled, client))
            .catch(err => console.info(err))
    } else if (msg.bad) { msg.react(client.emojis.get("304687480471289866"))  }
    
})

client.on("guildMemberAdd", member => {
    console.info("|-- New member on " + member.guild.name + ":" + member.guild.id + ", " + member.user.username + ":" + member.user.id)
    member.send(`${config.misc.welcome.heading} \`${member.guild.name}\`${config.misc.welcome.after}`)
        .catch(err => console.log(err))
    logger.log(7, member)
})

client.on("guildMemberRemove", member => {
    console.info("|-- Member left from " + member.guild.name + ":" + member.guild.id + ", " + member.user.username + ":" + member.user.id)
    logger.log(8, member)
})

client.on("guildCreate", guild => {
    console.info(`|-- New guild joined: ${guild.name}:${guild.id}. This guild has ${guild.memberCount} members.`)
    logger.log(9, guild)
})

client.on("guildDelete", guild => {
    console.log(`|-- Bot removed from: ${guild.name}:${guild.id}`)
    logger.log(10, guild)
})

client.on('reconnecting', () => {
    logger.log(4)
    console.log(`|-- ${time.get(1)} > Reconnecting to websocket..`)
})

client.on('resume', () => {
    logger.log(5)
    console.log(`|-- ${time.get(1)} > Reconnected successfully`)
})

client.on('error', err => {
    logger.log(3, err)
    console.log(`|-- ${time.get(1)} > Error has happended in the client, check ./log/`)
})

client.on('warn', warn => console.warn(warn))

process.on('uncaughtException', err => {
    logger.log(3, err)
    console.log(`|-- ${time.get(1)} > Error has happended in the process, check ./log/`)
})

client.login(authorize.token)
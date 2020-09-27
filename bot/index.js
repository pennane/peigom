process.chdir(__dirname)

const authorize = require('./config/authorize.json')
const schedule = require('node-schedule')
const CLIENT_CONFIG = require('config')
const Discord = require('discord.js')
const chalk = require('chalk')

const parser = require('./modules/core/messageParser')
const startingInfo = require('./modules/utilities/startingInfo')
const logger = require('./modules/utilities/activityLogger')

const zimmerTj = require('./modules/utilities/zimmerTJ')

const client = new Discord.Client()
client.timing = { timer: new Date(), completed: false }

let version = require(__dirname + '/../package.json').version

console.info(chalk.yellow(`Starting peigom-bot v.${version}`))


const fs = require('fs')
const path = require('path');
const scriptName = path.basename(__filename);
const targetFolder = __dirname + '/modules/commands';

let commands = fs.readdirSync(targetFolder).filter(file => file !== scriptName && file.endsWith(".js"));
if (!commands) throw new Error('faulty targetfolder')

let commandMetaMap = []

commands.forEach(commandFile => {
    let command = require(__dirname + `/modules/commands/${commandFile}`);
    commandMetaMap.push(command.configuration);
})

fs.writeFileSync(__dirname + '/../commandMetaMap.json', JSON.stringify(commandMetaMap))

const shuffleArray = (arr) => {
    let a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const s = Math.floor(Math.random() * (i + 1));
        [a[i], a[s]] = [a[s], a[i]];
    }
    return a;
}

client.on('ready', () => {
    let PRESENCE = CLIENT_CONFIG.get('DISCORD.PRESENCE')
    let activities = shuffleArray(PRESENCE.activities)
    let i = Math.floor(Math.random() * activities.length)

    startingInfo.set(client)
    client.user.setActivity(activities[i].text, { type: activities[i].type })

    zimmerTj(client)

    schedule.scheduleJob(`*/${PRESENCE.REFRESH_RATE} * * * *`, () => {
        client.user.setActivity(activities[i].text, { type: activities[i].type })
        if (i === activities.length - 1) i = 0;
        else i++;
    })

    logger.log(2)
})

client.on('message', async (msg) => {
    const ignoreMessage = msg.author.bot || msg.guild === null;
    if (ignoreMessage) return;
    parser.parseMsg(msg, client);
})

client.on("guildMemberAdd", (member) => logger.log(7, member))

client.on("guildMemberRemove", (member) => logger.log(8, member))

client.on("guildCreate", (guild) => logger.log(9, guild))

client.on("guildDelete", (guild) => logger.log(10, guild))

client.on('reconnecting', () => logger.log(4))

client.on('resume', () => logger.log(5))

client.on('error', (err) => logger.log(3, err))

client.on('warn', (warn) => console.warn(warn))

client.on('rateLimit', (reason) => console.log('Client being ratelimited:', reason))

process.on('uncaughtException', (err) => logger.log(3, err))

client.login(authorize.token)
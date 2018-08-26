process.chdir(__dirname);

const authorize = require('./config/authorize.json');

const schedule = require('node-schedule');
const config = require('config');
const Discord = require('discord.js');
const fs = require('fs');
const _ = require('underscore');

const MessageParser = require('./modules/core/message-parser.js');
const CommandHandler = require('./modules/core/command-handler.js');
const CommandExecutor = require('./modules/core/command-executor');
const ActivityLogger = require('./modules/functions/activity-logger');
const GetTime = require('./modules/functions/get-time.js');

var logger = ActivityLogger;
var time = GetTime;

const client = new Discord.Client();
client.IsBusy = false;
client.config = config;
client.CommandExecutor = CommandExecutor;
client.timing = {
    timer: console.time("| Connecting"),
    completed: false
};

client.usrdata = {};
if (!fs.existsSync('./data/user-data.json')) {
    fs.writeFileSync('./data/user-data.json', '{"users": {}}');
}
client.usrdata = JSON.parse(fs.readFileSync('./data/user-data.json', 'utf8'));

console.info(`Starting peigom-bot v.${client.config.app.version}`);

client.on('ready', () => {
    var StartingInfo = require('./modules/functions/starting-info');
    StartingInfo.set(client);
    logger.log(2);
    var presence = client.config.discord.presence;
    if (presence.activities.length === 1) {
        client.user.setActivity(presence.activities[0]);
    } else {
        var rand = Math.floor(Math.random() * presence.activities.length);
        var timing = Date.now();
        var i = rand;
        client.user.setActivity(presence.activities[rand]);
        console.log(`| Activity: ${presence.activities[rand]}`);
        var activityTimer = schedule.scheduleJob(`*/${presence.refreshrate} * * * *`, function (fireDate) {
            client.user.setActivity(client.config.get('discord.presence.activities')[i]);
            if (i === presence.activities.length - 1) {
                i = 0;
            } else {
                i++;
            }
        });
    }
});

client.on('reconnecting', () => {
    logger.log(4);
    console.log(`|--${time.get(1)} > Reconnecting to websocket..`)
});

client.on('resume', () => {
    logger.log(5);
    console.log(`|--${time.get(1)} > Reconnected successfully`)
});

client.on('message', msg => {
    if (!msg.author.bot && msg.guild !== null) {
        var BarWordArr = client.config.get('misc.badwords');
        if (BarWordArr.some(word => msg.content.includes(word))) {
            msg.badwords = true;
        } else {
            msg.badwords = false;
        }
        var prefix = client.config.get("discord.prefix");
        if (msg.content.startsWith(prefix)) msg.prefix = prefix;
        if (_.has(msg, 'prefix')) {
            MessageParser.parse(client, msg)
                .then(parsed => {
                    CommandHandler.parse(client, parsed)
                        .then(parsed => {
                            CommandExecutor.parse(parsed.msg, client, parsed.command, parsed.args)
                                .then(parsed => {
                                    /* */
                                })
                                .catch(error => console.info(error));
                        })
                        .catch(error => console.info(error));
                })
                .catch(error => console.info(error));
        } else if (msg.badwords) {
            msg.react(client.emojis.get("304687480471289866"));
        }
    }
});

client.on('error', error => {
    logger.log(3, error)
    .catch(error => console.log(error));
    console.log(`|-- ${time.get(1)} > Error has happended in the client, check ./log/`);
});

process.on('uncaughtException', error => {
    logger.log(3, error)
    .catch(error => console.log(error));
    console.log(`|-- ${time.get(1)} > Error has happended in the process, check ./log/`);
});

client.login(authorize.token);
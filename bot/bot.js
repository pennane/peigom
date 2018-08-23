process.chdir(__dirname);

const authorize = require('./config/authorize.json');

const config = require('config');
const Discord = require('discord.js');
const fs = require('fs');
const _ = require('underscore');

const MessageParser = require('./modules/core/message-parser.js');
const CommandHandler = require('./modules/core/command-handler.js');
const CommandExecutor = require('./modules/commands/command-executor.js');
const ActivityLogger = require('./modules/functions/activity-logger');
const GetTime = require('./modules/functions/get-time.js');

var logger = ActivityLogger;
var time = GetTime;

const client = new Discord.Client();
client.config = config;
client.CommandHandler = CommandHandler;
client.CommandExecutor = CommandExecutor;
client.timing = console.time("| Connecting")

client.usrdata = {};
if (!fs.existsSync('./data/user-data.json')) {
    fs.writeFileSync('./data/user-data.json', '{"users": {}}');
}
client.usrdata = JSON.parse(fs.readFileSync('./data/user-data.json', 'utf8'));

console.info(`Starting peigom-bot v.${client.config.app.version}`);

client.on('ready', () => {
    var StartingInfo = require('./modules/functions/starting-info');
    var Presence = require('./modules/functions/presence-changer.js');
    StartingInfo.set(client);
    Presence.set(client);
    logger.log(2);
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
            msg.containsBadWords = true;
        } else {
            msg.containsBadWords = false;
        }
        var prefix = client.config.get("discord.prefix");
        if (msg.content.startsWith(prefix)) msg.prefix = prefix;
        if (_.has(msg, 'prefix')) {
            MessageParser.parse(client, msg)
                .then(parsed => {
                    CommandHandler.parse(client, parsed)
                        .then(parsed => {
                            CommandExecutor.parse(client, parsed.msg, parsed.handled, parsed.handledargs);
                        });
                });
        } else if (msg.containsBadWords) {
            msg.react(client.emojis.get("304687480471289866"));
        }
    }
});

client.on('error', error => {
    logger.log(3, error);
    console.log(`|-- ${time.get(1)} > Error has happended in the client, check ./log/`);
});

process.on('uncaughtException', error => {
    logger.log(3, error);
    console.log(`|-- ${time.get(1)} > Error has happended in the process, check ./log/`);
});

client.login(authorize.token);
process.chdir(__dirname);

const config = require('config');
const Discord = require('discord.js');
const fs = require('fs');
const _ = require("underscore");

const MessageParser = require('./modules/core/message-parser.js');
const CommandHandler = require('./modules/core/command-handler.js');
const CommandExecutor = require('./modules/commands/command-Executor.js');

const client = new Discord.Client();
client.config = config;
client.MessageParser = MessageParser;
client.CommandHandler = CommandHandler;
client.CommandExecutor = CommandExecutor;
client.timing = {
      timing_start: Date.now()
};

var usrdata = JSON.parse(fs.readFileSync('./data/user-data.json', 'utf8'));

/* --------- ------ */

console.info(`Starting peigom-bot v.${client.config.get('app.version')}`);

client.on('ready', () => {
      console.info(`Logged in as ${client.user.tag}!`);
      console.info(`| Connecting: ${Date.now() - client.timing.conn_start}ms`);
      console.info(`| Loaded: ${Object.keys(client.config.commands).length} commands`);
      console.info(`| Loaded: ${Object.keys(usrdata.users).length} users with ${client.config.get("discord.prefix")}raha`);
      console.info(`| Loaded: ${client.config.misc.badwords.length} forbidden words`);
      if (client.config.get("misc.devmode") === true) {
            console.info(`| Dev mode: true`);
      }
      var date = new Date()
            .toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '');
      client.user.setActivity(config.get('discord.activity'));
});

/* Message listener */
client.on('message', msg => {
      if (!msg.author.bot && msg.guild !== null) {
            var BarWordArr = client.config.get('misc.badwords');
            if (BarWordArr.some(word => msg.content.includes(word))) {
                  msg.containsBadWords = true;
            } else {
                  msg.containsBadWords = false;
            }
            var prefix = client.config.get("discord.prefix");
            if (msg.content.startsWith(prefix)) {
                  msg.prefix = prefix;
            }
            if (_.has(msg, 'prefix')) {
                  client.MessageParser.parse(client, msg)
                        .then(parsed => {
                              client.CommandHandler.parse(client, parsed)
                                    .then(parsed => {
                                          client.CommandExecutor.parse(client, parsed.msg, parsed.handled, parsed.handledargs)
                                                .then(parsed => { });
                                    });
                        });
            } else if (msg.containsBadWords) {
                  msg.react(client.emojis.get("304687480471289866"));
            }
      }
});
client.timing.conn_start = Date.now();
/* Sends login token */
client.login(client.config.get('discord.token'));
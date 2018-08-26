const Discord = require('discord.js');
const authorize = require('../../config/authorize.json');
const config = require('../../config/default.json');
const client = new Discord.Client();


client.on('ready', () => {
    var presence = config.discord.presence;
    var rand = Math.floor(Math.random() * presence.activities.length);
    client.user.setActivity(presence.activities[rand]).t;
 });

client.login(authorize.token);
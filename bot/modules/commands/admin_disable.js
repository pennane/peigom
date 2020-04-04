const fs = require('fs');
const Discord = require('discord.js');
const syntaxEmbed = require('../utilities/syntaxEmbed')

if (!fs.existsSync('./assets/misc/disabledChannels/channels.json')) { fs.writeFileSync('./assets/misc/disabledChannels/channels.json', '{}') }
let disabledChannels = JSON.parse(fs.readFileSync('./assets/misc/disabledChannels/channels.json', 'utf8'))

let embed = new Discord.MessageEmbed().setColor(0xF4E542);


const configuration = {
    name: "bottitoimiitäällä",
    admin: false,
    syntax: "bottitoimiitäällä \<#channel> <ei/joo> tai bottitoimiitäällä <ei/joo>",
    desc: "Kosmeettisen virtuaalivaluutan pyörittelyyn",
    triggers: ["bottitoimiitäällä"],
    type: ["admin", "utility"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        const sendHowToUse = () => {
            let embed = syntaxEmbed({ configuration, args })
            msg.channel.send(embed).catch(err => console.info(err))
        }

        if (!args[1]) {
            sendHowToUse()
            return resolve();
        }
        let channelId;

        if (!args[2]) {
            channelId = msg.channel.id
        } else {
            channelId = args[1].match(/\d+/)[0];
        }


        if (!msg.guild.channels.cache.filter(channel => channel === channelId)) {
            sendHowToUse();
            return resolve();
        }

        if (!args[2]) {
            if (args[1] === "joo") {
                disabledChannels[channelId] = "listening";
                msg.channel.send(" Peigom kuuntelee taas <#" + channelId + ">")
            } else if (args[1] === "ei") {
                disabledChannels[channelId] = "disabled";
                msg.channel.send(" Peigom ei enää kuuntele <#" + channelId + ">")
            } else {
                sendHowToUse()
            }
        } else {
            if (args[2] === "joo") {
                disabledChannels[channelId] = "listening";
                msg.channel.send(" Peigom kuuntelee taas " + args[1])
            } else if (args[2] === "ei") {
                disabledChannels[channelId] = "disabled";
                msg.channel.send(" Peigom ei enää kuuntele " + args[1])
            } else {
                sendHowToUse()
            }
        }



        fs.writeFile('./assets/misc/disabledChannels/channels.json', JSON.stringify(disabledChannels), function (err) {
            if (err) {
                return console.info(err);
            }
        });
        resolve();
    });
}

module.exports.channelData = () => disabledChannels;

module.exports.configuration = configuration;
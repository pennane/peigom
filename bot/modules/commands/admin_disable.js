const config = require('config');
const fs = require('fs');
const Discord = require('discord.js');
const syntaxEmbed = require('../utilities/syntaxEmbed')

if (!fs.existsSync('./assets/misc/disabledChannels/channels.json')) { fs.writeFileSync('./assets/misc/disabledChannels/channels.json', '{}') }
let disabledChannels = JSON.parse(fs.readFileSync('./assets/misc/disabledChannels/channels.json', 'utf8'))

let embed = new Discord.RichEmbed().setColor(0xF4E542);


const meta = {
    name: "bottitoimiitäällä",
    admin: false,
    syntax: "bottitoimiitäällä #channel <ei/joo>",
    desc: "Kosmeettisen virtuaalivaluutan pyörittelyyn",
    triggers: ["bottitoimiitäällä"],
    type: ["admin", "utility"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (!args[1]) {
            let embed = syntaxEmbed({ meta, args })
            msg.channel.send(embed).catch(err => console.info(err))
            return resolve();
        }
        let channelId = args[1].match(/\d+/)[0];


        if (!msg.guild.channels.has(channelId)) {
            let embed = syntaxEmbed({ meta, args })
            msg.channel.send(embed).catch(err => console.info(err))
            return resolve();
        }

        if (args[2] === "joo") {
            disabledChannels[channelId] = "listening";
            msg.channel.send(" Peigom kuuntelee taas " + args[1])
        } else {
            disabledChannels[channelId] = "disabled";
            msg.channel.send(" Peigom ei enää kuuntele " + args[1])
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

module.exports.meta = meta;
const Discord = require('discord.js');
const config = require('config');
const prefix = config.discord.prefix;


module.exports = ({ meta, heading, body }) => {
    const embed = new Discord.MessageEmbed()
    embed.setColor("#FF0000")

    if (!meta) throw new Error("No meta to search syntax for.")
    if (!meta.syntax) throw new Error("Meta did not include command syntax.")
    if (!meta.name) throw new Error("Meta did not include a name for the commmand.")

    if (heading) {
        embed.title = heading
    } else {
        embed.title = `Komento ${meta.name} toimii näin:`
    }

    if (body) {
        embed.description = body
    } else {
        embed.description = `\`${prefix}${meta.syntax}\``
    }


    if (meta.triggers.length > 1) {
        embed.addField(`Vaihtoehtoiset nimet`, meta.triggers.join(" "))
    }

    return embed;
}
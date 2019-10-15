const Discord = require('discord.js');
const config = require('config');
const meta = {
    name: "äänestys",
    admin: false,
    syntax: "äänestys <Joo/ei kysymys>",
    desc: "Luo very ez äänestyksiä",
    triggers: ["vote", "äänestys"],
    type:  ["fun"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.RichEmbed()
            .setColor(0xF4E542);
        if (args.length === 1) {
            embed.setTitle(`Komento \`${meta.name}\` toimii näin:`)
                .setDescription(`\`\`${config.discord.prefix}${meta.syntax}\`\``)
            return resolve(msg.channel.send(embed).catch(err => console.error(err)));
        }
        let embedArgs = args
        embedArgs.splice(0, 1);
        embed
            .setTitle(`Käyttäjän ${msg.author.username} äänestys`)
            .setDescription(`${embedArgs.join(" ")}`)
            .setTimestamp();

        msg.channel.send(embed)
            .then(msg.delete())
            .then(msg => {
                msg.react("👍")
                    .then(msg.react("👎"))
            })
            .catch(err => console.info(err));
        resolve();
    })

}

module.exports.meta = meta;
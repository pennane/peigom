const Discord = require('discord.js');
const dictionary = require('urban-dictionary')



const meta = {
    name: "urban",
    admin: false,
    syntax: "urban <sana>",
    desc: "Hakee selitteen sanalle",
    triggers: ["urban", "dictionary", "define"],
    type:  ["fun"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.RichEmbed().setColor(0xF4E542);
        if (!args[1]) return msg.reply("Toimii näin: "+meta.syntax)
        let definition = [...args].splice(1).join(" ")
        let index =  0
        dictionary.term(definition).then(({entries}) => {
            embed.addField(entries[index].word,`
            \`\`\`${entries[index].definition.replace(/\[|\]/g, "")}\`\`\` 
            \`\`\`${entries[index].example.replace(/\[|\]/g, "")}\`\`\`
            [Link](${entries[index].permalink})`)
            .setFooter(entries[index].author, "https://arttu.pennanen.org/file/thonk.gif")
            .setTimestamp()
            msg.channel.send(embed)
        }).catch(() => {
            msg.channel.send(`Failed to retrieve definition for ${definition}`)
        })
        resolve();
    });
}

module.exports.meta = meta;
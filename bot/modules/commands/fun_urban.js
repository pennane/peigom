const Discord = require('discord.js');
const dictionary = require('urban-dictionary')
const syntaxEmbed = require('../utilities/syntaxEmbed')

const meta = {
    name: "urban",
    admin: false,
    syntax: "urban <sana>",
    desc: "Hakee selitteen sanalle",
    triggers: ["urban", "dictionary", "define"],
    type: ["fun"]
}



module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (!args[1]) {
            let embed = syntaxEmbed({ meta })
            msg.channel.send(embed)
            return resolve()
        }
        let definition = [...args].splice(1).join(" ")
        let index = 0
        dictionary.term(definition).then(({ entries }) => {
            let embed = new Discord.MessageEmbed().setColor(0xF4E542);
            embed.addField(entries[index].word, `
            \`\`\`${entries[index].definition.replace(/\[|\]/g, "")}\`\`\` 
            \`\`\`${entries[index].example.replace(/\[|\]/g, "")}\`\`\`
            [Link](${entries[index].permalink})`)
                .setFooter(entries[index].author, "https://arttu.pennanen.org/file/thonk.gif")
                .setTimestamp()
            msg.channel.send(embed)
        }).catch(() => {
            msg.channel.send(`Ei löytyny selitystä sanomalle ${definition}`)
        })
        resolve();
    });
}

module.exports.meta = meta;
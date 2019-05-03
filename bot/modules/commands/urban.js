const sound = require('../utilities/playSound.js');
const Discord = require('discord.js');
const dictionary = require('urban-dictionary')



const meta = {
    name: "urban",
    admin: false,
    syntax: "urban <sana>",
    desc: "Hakee selitteen sanalle",
    triggers: ["urban", "dictionary", "define"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.RichEmbed().setColor(0xF4E542);
        if (!args[1]) return msg.reply("Toimii näin:"+meta.syntax)
        var definition = args[1]
        // Promise example.
        dictionary.term(definition).then(({entries}) => {
            let index =  0
            embed
           /* .setTitle(entries[index].word)*/
            .addField(entries[index].word,`
            \`\`\` ${entries[index].definition.replace(/\[|\]/g, "")}\`\`\` 
            \`\`\`${entries[index].example.replace(/\[|\]/g, "")}\`\`\`
            [Link](${entries[index].permalink})`)
            .setFooter(entries[index].author, "https://arttu.pennanen.org/file/thonk.gif")
            .setTimestamp()
            msg.channel.send(embed)
         /*   msg.channel.send(`
            ${entries[0].word} \n
            ${entries[0].definition} \n
            ${entries[0].example}
            `)*/
        }).catch(({message}) => {
            msg.channel.send(`
            ${message}
            `)
        })
        resolve();
    });
}

module.exports.meta = meta;
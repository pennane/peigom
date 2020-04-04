const Discord = require('discord.js');
const { inspect } = require('util')
const beautify = require('js-beautify').js
const syntaxEmbed = require('../utilities/syntaxEmbed')

const configuration = {
    name: "evaluate",
    superadmin: true,
    syntax: "evaluate <javascript koodia>",
    desc: "Juoksee iloisesti javascript koodia",
    triggers: ["evaluate", "eval", "code", "js"],
    type: ["utility"],
}

function codeEval(code, msg, client) {
    let output;
    try {
        output = beautify(inspect(eval(code), { indent_size: 2, space_in_empty_paren: true }))
    } catch (err) {
        output = `Failed to evaluate: \n${err}`
    }
    finally {
        return output;
    }
}

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.MessageEmbed().setColor(0xF4E542);
        if (!args[1]) {
            let embed = syntaxEmbed({ configuration })
            return msg.reply(embed)
        }
        let code = [...args].splice(1).join(" ")
        let reply = codeEval(code, msg, client)
        if (reply.length > 2000) {
            embed.addField("Evaluation", `
        \`\`\`js\nFailed to send to discord: \nReceived content exceeded 2000 characters.\`\`\`
        `)
        } else {
            embed.addField("Evaluation", `
        \`\`\`js\n${reply}\`\`\`
        `)
        }

        embed.setFooter("Highly dangerous evaluation performed by Peigom Bot", "https://arttu.pennanen.org/file/thonk.gif")
            .setTimestamp()
        msg.channel.send(embed)
        resolve();
    });
}

module.exports.configuration = configuration;
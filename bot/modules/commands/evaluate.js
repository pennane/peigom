const Discord = require('discord.js');
const {inspect} = require('util')

const meta = {
    name: "evaluate",
    admin: true,
    syntax: "evaluate <javascript code>",
    desc: "Juoksee iloisesti javascript koodia",
    triggers: ["evaluate", "eval", "code", "js"]
}

function codeEval(code, msg, client) {
    let output;
    try {
        output = eval(code)
    } catch(err) {
        output = `Failed to evaluate: \n ${err}`
    }
    finally {
        output = inspect(output);
        return output;
    }
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.RichEmbed().setColor(0xF4E542);
        if (!args[1]) return msg.reply("Toimii näin: "+meta.syntax)
        let code = [...args].splice(1).join(" ")
        let reply = codeEval(code, msg, client)
        if (reply.length > 2000) {
            embed.addField("Evaluation", `
        \`\`\`js\n${code}\n==> Failed to send to discord: \nReceived content exceeded 2000 characters.\`\`\`
        `)
        } else {
            embed.addField("Evaluation", `
        \`\`\`js\n${code}\n==> ${reply}\`\`\`
        `)
        }
        
        embed.setFooter("Highly dangerous evaluation performed by Peigom Bot", "https://arttu.pennanen.org/file/thonk.gif")
            .setTimestamp()
        msg.channel.send(embed)
        resolve();
    });
}

module.exports.meta = meta;
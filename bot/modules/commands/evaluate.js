const Discord = require('discord.js');

const meta = {
    name: "evaluate",
    admin: true,
    syntax: "evaluate <javascript code>",
    desc: "Juoksee iloisesti javascript koodia",
    triggers: ["evaluate", "eval", "code", "js"]
}

function codeEval(code, msg) {
    let output;
    try {
        output = eval(code)
    } catch(err) {
        output = `Failed to evaluate: \n ${err}`
    }
    finally {
        return output;
    }
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.RichEmbed().setColor(0xF4E542);
        if (!args[1]) return msg.reply("Toimii näin: "+meta.syntax)
        let code = [...args].splice(1).join(" ")
        let reply = codeEval(code, msg)
        embed.addField("Evaluation", `
        \`\`\`js\n${code}\n==> ${reply}\`\`\`
        `)
        .setFooter("Highly dangerous evaluation done by Peigom Bot", "https://arttu.pennanen.org/file/thonk.gif")
            .setTimestamp()
        msg.channel.send(embed)
        resolve();
    });
}

module.exports.meta = meta;
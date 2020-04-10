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

function codeEval(code) {
    let output;
    try {
        output = inspect(eval(code), { indent_size: 2, space_in_empty_paren: true })
    } catch (err) {
        output = `Failed to evaluate: \n${err}`
    }
    finally {
        return output;
    }
}

function beautifyCode(code) {
    beautify(code)
}

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.MessageEmbed().setColor(0xF4E542);

        if (!args[1]) {
            let embed = syntaxEmbed({ configuration })
            return msg.reply(embed)
        }

        let stringToBeEvaluated = [...args].splice(1).join(" ")

        let evaluated = codeEval(stringToBeEvaluated)
        let beautified = beautify(evaluated)

        if (beautified.length < 1024) {
            embed.addField("Evaluation", `
            \`\`\`js\n${beautified}\`\`\`
            `)
        } else if (beautified.length < 10000) {
            let dividedCode = beautify(evaluated).match(/(.|[\r\n]){1,1024}/g)
            dividedCode.forEach(part => {
                let content = `\`\`\`js\n${part}\`\`\``;
                msg.channel.send(content)
            })
        } else {
            embed.addField("Evaluation", `
            \`\`\`js\nFailed to send to discord: \nReceived content exceeded the character limit.\`\`\`
            `)
        }

        embed.setFooter("Highly dangerous evaluation performed by Peigom Bot", "https://arttu.pennanen.org/file/thonk.gif")
            .setTimestamp()
        msg.channel.send(embed)
        resolve();
    });
}

module.exports.configuration = configuration;
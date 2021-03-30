import { Util } from 'discord.js'
import { inspect } from 'util'
import jsBeautify from 'js-beautify'
import Command, { CommandExecutor } from '../Command'
import syntaxEmbed from '../syntaxEmbed'

const beautify = jsBeautify.js

const configuration = {
    name: 'evaluate',
    superadmin: true,
    syntax: 'evaluate <javascript koodia>',
    desc: 'Juoksee iloisesti javascript koodia',
    triggers: ['evaluate', 'eval', 'code', 'js'],
    type: ['utility']
}

function evaluateCode(code: string) {
    let output
    try {
        output = inspect(eval(code))
    } catch (err) {
        output = `Failed to evaluate: \n${err}`
    } finally {
        return output
    }
}

const executor: CommandExecutor = async (message, client, args) => {
    if (!args[1]) {
        let embed = syntaxEmbed({ configuration })
        return message.reply(embed)
    }

    let stringToBeEvaluated = [...args].splice(1).join(' ')

    let evaluated = evaluateCode(stringToBeEvaluated)

    if (!evaluated) return

    let beautified = beautify(evaluated)

    let parts = Util.splitMessage(beautified, { maxLength: 5000 })

    parts.forEach((part, i) => {
        let embed = Command.createEmbed()
        let fields = Util.splitMessage(part, { maxLength: 1000 })
        fields.forEach((field) => {
            embed.addField('\u200b', `\`\`\`js\n${field}\n\`\`\``)
        })
        message.channel.send(embed)
    })

    return
}

export default new Command({
    configuration,
    executor
})

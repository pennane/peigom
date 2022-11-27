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

const evaluateCode = async (code: string): Promise<any> => {
    let output
    try {
        output = inspect(await eval(code))
    } catch (err) {
        output = `Failed to evaluate: \n${err}`
    } finally {
        return output
    }
}

const executor: CommandExecutor = async (message, client, args) => {
    if (!args[1]) {
        const embed = syntaxEmbed({ configuration })
        return message.reply({ embeds: [embed] })
    }

    const stringToBeEvaluated = [...args].splice(1).join(' ')

    const evaluated = await evaluateCode(stringToBeEvaluated)

    if (!evaluated) return

    const beautified = beautify(evaluated)

    const parts = Util.splitMessage(beautified, { maxLength: 5000 })

    parts.forEach((part, i) => {
        const embed = Command.createEmbed()
        const fields = Util.splitMessage(part, { maxLength: 1000 })
        fields.forEach((field) => {
            embed.addField('\u200b', `\`\`\`js\n${field}\n\`\`\``)
        })
        message.channel.send({ embeds: [embed] })
    })

    return
}

export default new Command({
    configuration,
    executor
})

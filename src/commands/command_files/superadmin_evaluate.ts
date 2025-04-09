import { ChannelType } from 'discord.js'
import jsBeautify from 'js-beautify'
import { inspect } from 'util'
import { splitMessage } from '../../lib/util'
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
  }
  return output
}

const executor: CommandExecutor = async (message, client, args) => {
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  if (!args[1]) {
    const embed = syntaxEmbed({ configuration })
    return message.reply({ embeds: [embed] })
  }

  const stringToBeEvaluated = [...args].splice(1).join(' ')

  const evaluated = await evaluateCode(stringToBeEvaluated)

  if (!evaluated) return

  const beautified = beautify(evaluated)

  const parts = splitMessage(beautified, { maxLength: 950 })

  parts.forEach((part) => {
    const embed = Command.createEmbed()
    const fields = splitMessage(part, { maxLength: 950 })
    fields.forEach((field) => {
      embed.addFields({ name: '\u200b', value: `\`\`\`js\n${field}\n\`\`\`` })
    })
    channel.send({ embeds: [embed] })
  })

  return
}

export default new Command({
  configuration,
  executor
})

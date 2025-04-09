import Discord from 'discord.js'
import * as AppConfiguration from '../lib/config'
import { CommandConfiguration } from './Command'

const prefix = AppConfiguration.PREFIX

export interface SyntaxEmbedOptions {
  configuration: CommandConfiguration
  heading?: string | null
  body?: string | null
}
const syntaxEmbed = ({ configuration, heading, body }: SyntaxEmbedOptions) => {
  const embed = new Discord.EmbedBuilder()
  embed.setColor('#FF0000')

  if (!configuration) throw new Error('No configuration to search syntax for.')
  if (!configuration.syntax)
    throw new Error('configuration did not include command syntax.')
  if (!configuration.name)
    throw new Error('configuration did not include a name for the commmand.')

  embed.setTitle(heading || `Komento ${configuration.name} toimii näin:`)
  embed.setDescription(body || `\`${prefix}${configuration.syntax}\``)

  if (configuration.triggers.length > 1) {
    embed.addFields({
      name: `Vaihtoehtoiset nimet komennolle`,
      value: configuration.triggers.join(' ')
    })
  }

  return embed
}

export default syntaxEmbed

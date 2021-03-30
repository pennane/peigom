import Discord from 'discord.js'
import { CommandConfiguration } from '../commands/Command'
import { PREFIX } from './config'

const SyntaxEmbed = ({
    configuration,
    heading,
    body
}: {
    configuration: CommandConfiguration
    heading?: string
    body?: string
}) => {
    const embed = new Discord.MessageEmbed()
    embed.setColor('#FF0000')

    if (!configuration) throw new Error('No configuration to search syntax for.')
    if (!configuration.syntax) throw new Error('configuration did not include command syntax.')
    if (!configuration.name) throw new Error('configuration did not include a name for the commmand.')

    embed.title = heading || `Komento ${configuration.name} toimii näin:`
    embed.description = body || `\`${PREFIX}${configuration.syntax}\``

    if (configuration.triggers.length > 1) {
        embed.addField(`Vaihtoehtoiset nimet`, configuration.triggers.join(' '))
    }

    return embed
}

export default SyntaxEmbed

import Command, { CommandExecutor, CommandConfiguration } from '../Command'
import { arrayToChunks } from '../../lib/util'
import { PREFIX } from '../../lib/config'
import { readSoundData } from './admin_createsound'

const configuration: CommandConfiguration = {
    name: 'listaaäänet',
    admin: false,
    syntax: 'listaaäänet (sivunro)',
    desc: 'Näyttää palvelimella käytössä olevat custom äänet',
    triggers: ['listaaäänet', 'listsounds'],
    type: ['utility'],
    requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
    if (!message.guild) return
    const customSounds = await readSoundData(message.guild)
    const soundNames = Object.keys(customSounds)

    const embed = Command.createEmbed()

    if (soundNames.length === 0) {
        message.channel.send('Ei custom äänikomentoja.')
        return
    }

    const soundNameChunks = arrayToChunks(soundNames, 8)
    const pageCount = soundNameChunks.length
    let pageNumber = parseInt(args[1]) || 1
    pageNumber = pageNumber - 1

    if (pageNumber < 0) pageNumber = 0
    else if (pageNumber > pageCount - 1) pageNumber = pageNumber - 1

    const currentPageSoundNames = soundNameChunks[pageNumber]

    embed.setTitle('Custom äänikomennot')
    currentPageSoundNames.forEach((soundName) => {
        embed.addField(`${PREFIX}${soundName}`, `Lisännyt <@${customSounds[soundName].addedBy}>`)
    })
    embed.setFooter(`Sivu ${pageNumber + 1} / ${pageCount}`)

    message.channel.send({ embeds: [embed] })
}

export default new Command({
    configuration,
    executor
})

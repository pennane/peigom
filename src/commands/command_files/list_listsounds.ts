import Command, { CommandExecutor, CommandConfiguration } from '../Command'
import fs from 'fs/promises'
import { arrayToChunks, fetchFile } from '../../lib/util'
import getLoadedCommands from '../loader'
import { PREFIX } from '../../../dist/lib/config'
import { readSoundData } from './admin_createsound'

const configuration: CommandConfiguration = {
    name: 'listaaäänet',
    admin: true,
    syntax: 'listaaäänet (sivunro)',
    desc: 'Näyttää custom äänet',
    triggers: ['listaaäänet', 'listsounds'],
    type: ['utility'],
    requireGuild: false
}

const executor: CommandExecutor = async (message, client, args) => {
    const customSounds = await readSoundData()
    const soundNames = Object.keys(customSounds)

    let embed = Command.createEmbed()

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

    let currentPageSoundNames = soundNameChunks[pageNumber]

    embed.setTitle('Custom äänikomennot')
    currentPageSoundNames.forEach((soundName) => {
        embed.addField(`${PREFIX}${soundName}`, `\u200B`)
    })
    embed.setFooter(`Sivu ${pageNumber + 1} / ${pageCount}`)

    message.channel.send(embed)
}

export default new Command({
    configuration,
    executor
})

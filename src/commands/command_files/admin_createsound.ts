import Command, { CommandExecutor, CommandConfiguration } from '../Command'
import fs from 'fs/promises'
import { fetchFile } from '../../lib/util'
import getLoadedCommands from '../loader'
import { PREFIX } from '../../lib/config'

const configuration: CommandConfiguration = {
    name: 'luoääni',
    admin: true,
    syntax: 'luoääni <nimi>',
    desc: 'Luo äänikomento, lisää mp3 ääni liitteenä',
    triggers: ['luoääni', 'createsound'],
    type: ['admin', 'utility'],
    requireGuild: false
}

let soundDataLocation = './assets/createsound/data.json'

export type CustomSoundCommandData = {
    name: string
    addedBy: string
    date: number
    file: string
}

type SoundData = {
    [name: string]: CustomSoundCommandData
}

export const readSoundData = async (): Promise<SoundData> => {
    let file
    try {
        file = await fs.open(soundDataLocation, 'r')
    } catch {
        await fs.writeFile(soundDataLocation, '{}')
    } finally {
        if (file) file.close()
    }

    const data = await fs.readFile(soundDataLocation, 'utf8')
    return JSON.parse(data)
}
export const writeSoundData = async (data: any): Promise<void> => {
    await fs.writeFile(soundDataLocation, JSON.stringify(data))
}

readSoundData()

const executor: CommandExecutor = async (message, client, args) => {
    const soundFileExtensions = ['mp3']

    const sendHowToUse = () => {
        let embed = Command.syntaxEmbed({ configuration })
        message.channel.send(embed).catch((err) => console.info(err))
    }

    let name = args[1]

    if (!name || name === null) {
        sendHowToUse()
        return
    }

    let attachedSoundFile = message.attachments.find((file) =>
        soundFileExtensions.some((ext) => file.name?.toLowerCase()?.endsWith(ext.toLocaleLowerCase()))
    )

    if (!attachedSoundFile) {
        sendHowToUse()
        return
    }

    if (attachedSoundFile.size > 3000000) {
        message.channel.send('Liian iso tiedosto. Vain alle 3mb on ok')
        return
    }

    const loadedCommands = await getLoadedCommands()
    const loadedBaseTriggers = loadedCommands.triggers

    let identifier = Date.now() + '-' + Math.round(Math.random() * 100000)
    let fileName = `${args[1].toLowerCase()}-${identifier}.mp3`
    let target = `./assets/createsound/files/${fileName}`

    if (name in loadedBaseTriggers) {
        message.channel.send('Nimi on jo käytössä')
        return
    }

    const loadedCustomSounds = await readSoundData()

    if (name in loadedCustomSounds) {
        message.channel.send('Nimi on jo toisella äänellä käytössä')
        return
    }
    try {
        await fetchFile({ url: attachedSoundFile.url, target: target })
    } catch (e) {
        console.error(e)
        return
    }

    const newData = {
        ...loadedCustomSounds,
        [name]: { name: name, addedBy: message.author.id, date: Date.now(), file: fileName }
    }

    await writeSoundData(newData)

    let embed = Command.createEmbed()
    embed.setTitle('Ääni luotu!')
    embed.setDescription(PREFIX + name + ' pitäs toimii nyt :  >')
    message.channel.send(embed)
}

export default new Command({
    configuration,
    executor
})

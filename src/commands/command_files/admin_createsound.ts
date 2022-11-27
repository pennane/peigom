import Command, { CommandExecutor, CommandConfiguration } from '../Command'
import fs from 'fs/promises'
import { fetchFile } from '../../lib/util'
import getLoadedCommands from '../loader'
import { PREFIX } from '../../lib/config'
import { Guild } from 'discord.js'
import FileType from 'file-type'
import { log } from '../../lib/activityLogger'

const configuration: CommandConfiguration = {
    name: 'luoääni',
    admin: true,
    syntax: 'luoääni <nimi> (liitteenä lisätty mp3 tiedosto, max 4mb)',
    desc: 'Luo äänikomento vain palvelimen käyttöön, lisää mp3 ääni liitteenä, max 4mb',
    triggers: ['luoääni', 'createsound'],
    type: ['admin', 'utility'],
    requireGuild: true
}

export type CustomSoundCommandData = {
    name: string
    addedBy: string
    date: number
    file: string
}

type SoundData = {
    [name: string]: CustomSoundCommandData
}

export const readSoundData = async (guild: Guild): Promise<SoundData> => {
    const guildDataDirectory = './assets/createsound/guilds/' + guild.id + '/'
    const guildSoundDataPath = guildDataDirectory + 'data.json'

    try {
        await fs.mkdir(guildDataDirectory)
    } catch {}

    let file

    try {
        file = await fs.open(guildSoundDataPath, 'r')
    } catch {
        await fs.writeFile(guildSoundDataPath, '{}')
    } finally {
        if (file) file.close()
    }

    const data = await fs.readFile(guildSoundDataPath, 'utf8')
    return JSON.parse(data)
}
export const writeSoundData = async (guild: Guild, data: any): Promise<void> => {
    const guildDataDirectory = './assets/createsound/guilds/' + guild.id + '/'
    const guildSoundDataPath = guildDataDirectory + 'data.json'
    await fs.writeFile(guildSoundDataPath, JSON.stringify(data))
}

const executor: CommandExecutor = async (message, client, args) => {
    if (!message.guild) return

    const soundFileExtensions = ['mp3']

    const sendHowToUse = () => {
        const embed = Command.syntaxEmbed({ configuration })
        message.channel.send({ embeds: [embed] }).catch((err) => console.info(err))
    }

    const soundCommandName = args[1]

    if (!soundCommandName || soundCommandName === null) {
        sendHowToUse()
        return
    }

    const attachedSoundFile = message.attachments.find((file) =>
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

    const identifier = Date.now() + '-' + Math.round(Math.random() * 100000)
    const fileName = `${args[1].toLowerCase()}-${identifier}.mp3`
    const target = `./assets/createsound/guilds/${message.guild.id}/${fileName}`

    if (soundCommandName in loadedBaseTriggers) {
        message.channel.send('Nimi on jo käytössä')
        return
    }

    if (!message.guild) {
        message.channel.send('Lähetä viesti palvelimen teksikanavalle')
        return
    }

    const loadedCustomSounds = await readSoundData(message.guild)

    if (soundCommandName in loadedCustomSounds) {
        message.channel.send('Nimi on jo toisella äänellä käytössä')
        return
    }

    let soundFileType
    try {
        await fetchFile({ url: attachedSoundFile.url, target: target })
        soundFileType = await FileType.fromFile(target)
        if (soundFileType?.mime !== 'audio/mpeg') {
            throw new Error()
        }
    } catch (e) {
        message.channel.send('Ei perseillä. Pelkkiä mp3 tiedostoja.')
        log({
            id: 15,
            content: `User ${
                message.author.username + ' @' + message.author.id
            } tried to upload file with this information: Name:${fileName} Ext:${soundFileType?.ext} Mime:${
                soundFileType?.mime
            }`
        })
        return
    }

    const newData = {
        ...loadedCustomSounds,
        [soundCommandName]: { name: soundCommandName, addedBy: message.author.id, date: Date.now(), file: fileName }
    }

    await writeSoundData(message.guild, newData)

    const embed = Command.createEmbed()
    embed.setTitle(`Ääni luotu palvelimeen ${message.guild.name} !`)
    embed.setDescription(`Komento \`${PREFIX}${soundCommandName}\` on nyt käytössä.`)
    message.channel.send({ embeds: [embed] })
}

export default new Command({
    configuration,
    executor
})

import Command, { CommandExecutor, CommandConfiguration } from '../Command'
import { readSoundData, writeSoundData } from './admin_createsound'

const configuration: CommandConfiguration = {
    name: 'poistaääni',
    admin: true,
    syntax: 'poistaääni <nimi>',
    desc: 'Poista äänikomento',
    triggers: ['poistaääni', 'removesound'],
    type: ['admin', 'utility'],
    requireGuild: false
}

const executor: CommandExecutor = async (message, client, args) => {
    const sendHowToUse = () => {
        let embed = Command.syntaxEmbed({ configuration })
        message.channel.send(embed).catch((err) => console.info(err))
    }

    const customSoundCommands = await readSoundData()
    const soundToRemove = args[1]
    if (!soundToRemove) {
        sendHowToUse()
        return
    }

    const commandExists = soundToRemove in customSoundCommands

    if (!commandExists) {
        message.channel.send('Ääntä ei ole edes ollut olemassa. Tarkista kirjoitusasu')
        return
    }

    delete customSoundCommands[soundToRemove]

    await writeSoundData(customSoundCommands)

    message.channel.send('Ääni poistettu')
}

export default new Command({
    configuration,
    executor
})

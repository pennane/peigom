import { ChannelType } from 'discord.js'
import fs from 'fs/promises'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import { readSoundData, writeSoundData } from './admin_createsound'

const configuration: CommandConfiguration = {
  name: 'poistaääni',
  admin: true,
  syntax: 'poistaääni <nimi>',
  desc: 'Poista äänikomento palvelimen käytöstä',
  triggers: ['poistaääni', 'removesound'],
  type: ['admin', 'utility'],
  requireGuild: true
}

const executor: CommandExecutor = async (message, client, args) => {
  const channel = message.channel
  if (channel.type !== ChannelType.GuildText) return
  const sendHowToUse = () => {
    const embed = Command.syntaxEmbed({ configuration })
    channel.send({ embeds: [embed] }).catch((err) => console.info(err))
  }

  if (!message.guild) return

  const customSoundCommands = await readSoundData(message.guild)
  const soundToRemove = args[1]
  if (!soundToRemove) {
    sendHowToUse()
    return
  }

  const commandExists = soundToRemove in customSoundCommands

  if (!commandExists) {
    channel.send('Ääntä ei ole edes ollut olemassa. Tarkista kirjoitusasu')
    return
  }

  const soundCommand = customSoundCommands[soundToRemove]

  if (
    soundCommand.addedBy !== message.author.id &&
    message.author.id !== message.guild.ownerId
  ) {
    channel.send('Voit poistaa vain omia ääniä ellet ole palvelimen omistaja.')
    return
  }

  fs.unlink(
    `./assets/createsound/guilds/${message.guild.id}/${customSoundCommands[soundToRemove].file}`
  )

  delete customSoundCommands[soundToRemove]

  await writeSoundData(message.guild, customSoundCommands)

  channel.send('Ääni poistettu')
}

export default new Command({
  configuration,
  executor
})

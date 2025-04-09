import { EmbedBuilder, TextChannel } from 'discord.js'
import * as AppConfiguration from '../../lib/config'
import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import commandLoader from '../loader'

const prefix = AppConfiguration.PREFIX

const configuration: CommandConfiguration = {
  name: 'auta',
  admin: false,
  syntax: 'auta <komennon/toiminnon nimi>',
  desc: 'Kertoo tietoa botin komennoista ja toiminnoista',
  triggers: ['auta', 'help', 'hjälp'],
  type: ['utility'],
  requireGuild: true
}

const embedConfiguration = {
  desc: 'Vähän tietoa komennoista ja toiminnasta.',
  color: 0xf4e542,
  author: 'Susse#9999',
  footer: 'bumtsi bum, nimi o peigom © 2018-2021'
}

async function loadCommandData() {
  const { commands: loadedCommands } = await commandLoader()
  const triggers: Map<string, string> = new Map()
  const types: { [type: string]: Command[] } = {}

  loadedCommands.forEach((command, name) => {
    if (!AppConfiguration.YOUTUBE_API_KEY && command.types.includes('music'))
      return
    if (command.hidden) return

    command.types.forEach((type) => {
      types[type] = types[type] ? types[type].concat(command) : [command]
    })

    command.triggers.forEach((trigger) => {
      if (!triggers.has(trigger)) {
        triggers.set(trigger, name)
      }
    })
  })

  return { commands: loadedCommands, triggers, types }
}

const commandData = loadCommandData()

const executor: CommandExecutor = async (message, client, args) => {
  const { commands, triggers, types } = await commandData

  const action = args[1]?.toLowerCase() || null
  const subAction = args[2]?.toLowerCase() || null

  function createBaseEmbed() {
    return new EmbedBuilder()
      .setAuthor({
        name: `${client.user?.username}`,
        iconURL: `${client.user?.avatarURL()}`
      })
      .setTitle(`${AppConfiguration.APP.NAME}  \`${configuration.name}\``)
      .setColor(embedConfiguration.color)
      .setDescription(embedConfiguration.desc)
      .setFooter({
        text: embedConfiguration.footer,
        iconURL: 'https://arttu.pennanen.org/file/thonk.gif'
      })
      .setTimestamp()
  }

  function createNoActionEmbed(action: string) {
    const embed = createBaseEmbed()
    embed.setTitle(':eyes: Hupsista')
    embed.setDescription(
      `Antamaasi \`${prefix}${configuration.name}\` toimintoa \`${action}\` ei ole olemassa.`
    )
    embed.addFields([
      {
        name: ':pencil: **Kokeile**',
        value: `\`${prefix}${configuration.name} komennot\``,
        inline: false
      },
      {
        name: '(tai pelkästään',
        value: `${prefix}${configuration.name})`,
        inline: false
      }
    ])
    return embed
  }

  function createHomeEmbed() {
    const embed = createBaseEmbed()
    const adminAuthorized = Command.isMemberSuperAdminAuthorized(message)

    embed.addFields([
      {
        name: ':mega: Tietoa komennoista:',
        value: `\`${prefix}${configuration.name} komennot\``,
        inline: false
      }
    ])

    if (adminAuthorized) {
      embed.addFields([
        {
          name: ':loudspeaker: Tietoa admin komennoista:',
          value: `\`${prefix}${configuration.name} admin\``,
          inline: false
        }
      ])
    }

    embed.addFields([
      {
        name: ':thinking: Tietoa botista:',
        value: `\`${prefix}${configuration.name} ${AppConfiguration.APP.NAME} \``,
        inline: false
      },
      {
        name: ':question: Tietoa tietystä komennosta:',
        value: `\`${prefix}${configuration.name} <komennon nimi> \``,
        inline: false
      }
    ])

    return embed
  }

  function createTypesEmbed(loadedTypes: { [type: string]: Command[] }) {
    const embed = createBaseEmbed()
    let typeKeys = Object.keys(loadedTypes)
    const variants = Command.variants()
    const adminAuthorized = Command.isMemberAdminAuthorized(message)
    const superadminAuthorized = Command.isMemberSuperAdminAuthorized(message)

    if (!adminAuthorized) typeKeys = typeKeys.filter((t) => t !== 'admin')
    if (!superadminAuthorized)
      typeKeys = typeKeys.filter((t) => t !== 'superadmin')

    embed.setTitle('Komentotyypit:')
    embed.setDescription('Kaikki eri komentotyypit listattuna')

    typeKeys.forEach((type) => {
      const variant = variants[type]
      const count = loadedTypes[type].length
      embed.addFields([
        {
          name: `${variant.emoji} ${variant.name}`,
          value: `\`${prefix}${configuration.name} ${type}\`\n${
            count === 1 ? '1 komento' : `${count} komentoa`
          }`,
          inline: true
        }
      ])
    })

    if (typeKeys.length % 3 === 2) {
      embed.addFields([{ name: '​', value: '​', inline: true }])
    }

    return embed
  }

  function createCommandTypeEmbed(type: string, typeCommands: Command[]) {
    const embed = createBaseEmbed()
    embed.setTitle(`Tyypin \`${type}\` komennot`)
    embed.setDescription(`Kaikki antamasi tyypin \`${type}\` komennot`)

    const isAdmin = Command.isMemberAdminAuthorized(message)
    const isSuperAdmin = Command.isMemberSuperAdminAuthorized(message)

    if (
      (type === 'admin' && !isAdmin) ||
      (type === 'superadmin' && !isSuperAdmin)
    ) {
      embed.addFields([
        { name: ':sos: Tsot tsot', value: 'et sä saa näitä nähdä.' }
      ])
      return embed
    }

    let commands = typeCommands
    if (!isAdmin && !isSuperAdmin) {
      commands = commands.filter(
        (c) => !c.types.includes('admin') && !c.types.includes('superadmin')
      )
    } else if (!isAdmin) {
      commands = commands.filter((c) => !c.types.includes('admin'))
    } else if (!isSuperAdmin) {
      commands = commands.filter((c) => !c.types.includes('superadmin'))
    }

    if (commands.length === 0) {
      embed.setDescription(
        `¯\\_(ツ)_/¯ Tyyppi \`${type}\` ei sisällä komentoja`
      )
      return embed
    }

    commands.forEach((command) => {
      embed.addFields([
        {
          name: `${
            command.types.includes('admin') ||
            command.types.includes('superadmin')
              ? ':unlock: '
              : ''
          }${command.name}`,
          value: `\`${prefix}${configuration.name} ${command.name} \``,
          inline: true
        }
      ])
    })

    if (commands.length % 3 === 2) {
      embed.addFields([{ name: '​', value: '​', inline: true }])
    }

    return embed
  }

  function createApplicationInformationEmbed() {
    const embed = createBaseEmbed()
    const avatarURL = client.user?.avatarURL()
    if (avatarURL) embed.setThumbnail(avatarURL)

    embed
      .setTitle(`${AppConfiguration.APP.NAME}  \`tietoa\``)
      .setDescription('Tietoa botista')
      .addFields([
        {
          name: `:question: Mikä ihmeen ${AppConfiguration.APP.NAME} ?`,
          value: `${AppConfiguration.APP.NAME} on [node.js](https://nodejs.org/) discord botti, jonka lähdekoodi on [nähtävillä](https://github.com/Pennane/peigom-bot).`,
          inline: false
        },
        {
          name: ':vertical_traffic_light: Versio:',
          value: `${AppConfiguration.APP.VERSION}`,
          inline: false
        },
        {
          name: ':1234: Komentojen määrä:',
          value: commands.size.toString(),
          inline: true
        },
        {
          name: ':file_cabinet: Serverien määrä:',
          value: client.guilds.cache.size.toString(),
          inline: true
        },
        {
          name: ':pencil: Kehittäjä:',
          value: '@Susse#9999',
          inline: true
        }
      ])

    return embed
  }

  function createCommandEmbed(command: Command) {
    const isAdmin = Command.isMemberAdminAuthorized(message)
    const isSuperAdmin = Command.isMemberSuperAdminAuthorized(message)
    const embed = createBaseEmbed()

    if (
      (command.types.includes('admin') && !isAdmin) ||
      (command.types.includes('superadmin') && !isSuperAdmin)
    ) {
      embed.addFields([
        { name: ':sos: tsot tsot', value: 'et sina nähdä tänne' }
      ])
      return embed
    }

    embed
      .setDescription(
        `Tietoa komennosta: \`${prefix}${command.name}\` (${command.types.join(
          ' '
        )})`
      )
      .addFields([
        {
          name: ':pencil: Komento toimii näin:',
          value: `\`${prefix}${command._syntax}\``,
          inline: false
        },
        {
          name: ':gear: Komennon toiminto:',
          value: `${command._description}`,
          inline: false
        },
        {
          name: ':book: Komennon liipaisimet:',
          value: `\`${prefix + [...command.triggers].join(' ' + prefix)}\``,
          inline: false
        }
      ])

    if (command._superadminCommand || command.types.includes('superadmin')) {
      embed.addFields([
        {
          name: ':warning::warning: **Huom**',
          value: 'Kyseessä on super admin komento.'
        }
      ])
    } else if (command._adminCommand || command.types.includes('admin')) {
      embed.addFields([
        { name: ':warning: **Huom**', value: 'Kyseessä on admin komento.' }
      ])
    }

    return embed
  }

  const channel = message.channel as TextChannel

  if (!action) return channel.send({ embeds: [createHomeEmbed()] })
  else if (action === 'komennot' && !subAction)
    return channel.send({ embeds: [createTypesEmbed(types)] })
  else if (action === 'komennot' && subAction && types[subAction])
    return channel.send({
      embeds: [createCommandTypeEmbed(action, types[action])]
    })
  else if (types[action])
    return channel.send({
      embeds: [createCommandTypeEmbed(action, types[action])]
    })
  else if (action === AppConfiguration.APP.NAME.toLowerCase())
    return channel.send({ embeds: [createApplicationInformationEmbed()] })
  else if (triggers.has(action)) {
    const name = triggers.get(action)
    if (!name) throw new Error('this simply can not happen')
    const command = commands.get(name)
    if (!command)
      throw new Error('action in triggers but trigger not in command')
    return channel.send({ embeds: [createCommandEmbed(command)] })
  } else return channel.send({ embeds: [createNoActionEmbed(action)] })
}

export default new Command({ configuration, executor })

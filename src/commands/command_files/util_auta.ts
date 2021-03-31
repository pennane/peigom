import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import * as AppConfiguration from '../../util/config'
import commandLoader from '../loader'
import Discord from 'discord.js'

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
    let { commands: loadedCommands } = await commandLoader()
    let triggers: Map<string, string> = new Map()
    let types: {
        [type: string]: Command[]
    } = {}

    loadedCommands.forEach((command, name) => {
        if (!AppConfiguration.YOUTUBE_API_KEY && command.types.some((type) => type === 'music')) return

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

let commandData = loadCommandData()

const executor: CommandExecutor = async (message, client, args) => {
    let { commands, triggers, types } = await commandData

    let action = args[1] ? args[1].toLowerCase() : null
    let subAction = args[2] ? args[2].toLowerCase() : null

    function createBaseEmbed() {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user?.username}`, `${client.user?.avatarURL()}`)
            .setTitle(`${AppConfiguration.APP.NAME}  \`${configuration.name}\``)
            .setColor(embedConfiguration.color)
            .setDescription(embedConfiguration.desc)
            .setFooter(embedConfiguration.footer, 'https://arttu.pennanen.org/file/thonk.gif')
            .setTimestamp()

        return embed
    }

    function createNoActionEmbed(action: string): Discord.MessageEmbed {
        let embed = createBaseEmbed()

        embed
            .setTitle(':eyes: Hupsista')
            .setDescription(`Antamaasi \`${prefix}${configuration.name}\` toimintoa \`${action}\` ei ole olemassa.`)
            .addField(
                `:pencil: **Kokeile** \`${prefix}${configuration.name} komennot\``,
                `(tai pelkästään ${prefix}${configuration.name})`
            )
        return embed
    }

    function createHomeEmbed() {
        let embed = createBaseEmbed()
        let adminAuthorized = Command.isMemberSuperAdminAuthorized(message)

        embed.addField(`:mega: Tietoa komennoista:`, `\`${prefix}${configuration.name} komennot\``, false)
        if (adminAuthorized) {
            embed.addField(`:loudspeaker: Tietoa admin komennoista:`, `\`${prefix}${configuration.name} admin\``, false)
        }

        embed.addField(
            `:thinking: Tietoa botista:`,
            `\`${prefix}${configuration.name} ${AppConfiguration.APP.NAME} \``,
            false
        )
        embed.addField(
            `:question: Tietoa tietystä komennosta:`,
            `\`${prefix}${configuration.name} <komennon nimi> \``,
            false
        )
        return embed
    }

    function createTypesEmbed(loadedTypes: { [type: string]: Command[] }): Discord.MessageEmbed {
        let embed = createBaseEmbed()
        let types = Object.keys(loadedTypes)
        let variants = Command.variants()

        let adminAuthorized = Command.isMemberAdminAuthorized(message)
        let superadminAuthorized = Command.isMemberSuperAdminAuthorized(message)

        if (!adminAuthorized) {
            types = types.filter((type) => type !== 'admin')
        }

        if (!superadminAuthorized) {
            types = types.filter((type) => type !== 'superadmin')
        }

        embed.setTitle('Komentotyypit:')
        embed.setDescription('Kaikki eri komentotyypit listattuna')

        types.forEach((type) => {
            let variant = variants[type]
            let amountOfCommands = loadedTypes[type].length
            embed.addField(
                `${variant.emoji} ${variant.name}`,
                `\`${prefix}${configuration.name} ${type}\`\n${
                    amountOfCommands === 1 ? '1 komento' : `${amountOfCommands} komentoa`
                }`,
                true
            )
        })

        if (types.length % 3 === 2) {
            embed.addField('\u200b', '\u200b', true)
        }

        return embed
    }

    function createCommandTypeEmbed(type: string, typeCommands: Command[]): Discord.MessageEmbed {
        let embed = createBaseEmbed()

        embed.setTitle(`Tyypin \`${type}\` komennot`)
        embed.setDescription(`Kaikki antamasi tyypin \`${type}\` komennot`)

        let isAdmin = Command.isMemberAdminAuthorized(message)
        let isSuperAdmin = Command.isMemberSuperAdminAuthorized(message)

        if (type.toLowerCase() === 'admin' && !isAdmin) {
            embed.addField(':sos: Tsot tsot', 'et sä saa näitä nähdä.')
            return embed
        } else if (type.toLowerCase() === 'superadmin' && !isSuperAdmin) {
            embed.addField(':sos: Tsot tsot', 'et sä saa näitä nähdä.')
            return embed
        }

        let commands = typeCommands

        if (!isAdmin && !isSuperAdmin) {
            commands = commands.filter(
                (command) => !command.types.some((type) => type === 'admin' || type === 'superadmin')
            )
        } else if (!isAdmin) {
            commands = commands.filter((command) => !command.types.some((type) => type === 'admin'))
        } else if (!isSuperAdmin) {
            commands = commands.filter((command) => !command.types.some((type) => type === 'superadmin'))
        }

        if (commands.length === 0) {
            embed.setDescription(`¯\\_(ツ)_/¯ Tyyppi \`${type}\` ei sisällä komentoja`)
            return embed
        }

        commands.forEach((command) => {
            embed.addField(
                ` ${command.types.includes('admin') || command.types.includes('superadmin') ? ':unlock: ' : ''}${
                    command.name
                }`,
                `\`${prefix}${configuration.name} ${command.name} \``,
                true
            )
        })

        if (commands.length % 3 === 2) {
            embed.addField('\u200b', '\u200b', true)
        }

        return embed
    }

    function createApplicationInformationEmbed(): Discord.MessageEmbed {
        let embed = createBaseEmbed()
        let avatarURL = client.user?.avatarURL()
        if (avatarURL) {
            embed.setThumbnail(avatarURL)
        }
        embed
            .setTitle(`${AppConfiguration.APP.NAME}  \`tietoa\``)
            .setDescription(`Tietoa botista`)
            .addField(
                `:question: Mikä ihmeen ${AppConfiguration.APP.NAME} ?`,
                `${AppConfiguration.APP.NAME} on [node.js](https://nodejs.org/) discord botti, jonka lähdekoodi on [nähtävillä](https://github.com/Pennane/peigom-bot).`,
                false
            )
            .addField(`:vertical_traffic_light: Versio:`, `${AppConfiguration.APP.VERSION}`, false)

            .addField(`:1234: Komentojen määrä:`, commands.size, true)
            .addField(`:file_cabinet: Serverien määrä:`, client.guilds.cache.size, true)
            .addField(`:pencil: Kehittäjä:`, `@Susse#9999`, true)
        return embed
    }

    function createCommandEmbed(command: Command): Discord.MessageEmbed {
        let isAdmin = Command.isMemberAdminAuthorized(message)
        let isSuperAdmin = Command.isMemberSuperAdminAuthorized(message)

        let embed = createBaseEmbed()

        if (command.types.includes('admin') && !isAdmin) {
            embed.addField(':sos: tsot tsot', 'et sina nähdä tänne')
            return embed
        } else if (command.types.includes('superadmin') && !isSuperAdmin) {
            embed.addField(':sos: tsot tsot', 'et sina nähdä tänne')
            return embed
        }

        embed
            .setDescription(`Tietoa komennosta: \`${prefix}${command.name}\` (${command.types.join(' ')})`)
            .addField(`:pencil: Komento toimii näin:`, `\`${prefix}${command._syntax}\``)
            .addField(`:gear: Komennon toiminto:`, `${command._description}`)
            .addField(`:book: Komennon liipaisimet:`, `\`${prefix + [...command.triggers].join(' ' + prefix)}\``)
            .addField('\u200b', '\u200b')

        if (command._superadminCommand || command.types.includes('superadmin')) {
            embed.addField(`:warning::warning: **Huom**`, `Kyseessä on super admin komento.`)
        } else if (command._adminCommand || command.types.includes('admin')) {
            embed.addField(`:warning: **Huom**`, `Kyseessä on admin komento.`)
        }
        return embed
    }

    if (!action) {
        return message.channel.send(createHomeEmbed())
    } else if (action === 'komennot' && !subAction) {
        return message.channel.send(createTypesEmbed(types))
    } else if (action === 'komennot' && subAction && types[subAction]) {
        let commands = types[action]
        return message.channel.send(createCommandTypeEmbed(action, commands))
    } else if (types[action]) {
        let commands = types[action]
        return message.channel.send(createCommandTypeEmbed(action, commands))
    } else if (action === AppConfiguration.APP.NAME.toLowerCase()) {
        return message.channel.send(createApplicationInformationEmbed())
    } else if (triggers.has(action)) {
        let name = triggers.get(action)

        if (!name) throw new Error('this simply can not happen')

        let command = commands.get(name)

        if (!command) throw new Error('action in triggers but trigger not in command')

        message.channel.send(createCommandEmbed(command))
    } else {
        message.channel.send(createNoActionEmbed(action))
    }

    return
}

export default new Command({
    configuration,
    executor
})

import Discord from 'discord.js'
import activityLogger from '../util/activityLogger'
import * as AppConfiguration from '../util/config'
import SyntaxEmbed, { SyntaxEmbedOptions } from './syntaxEmbed'

export type CommandExecutor = (message: Discord.Message, client: Discord.Client, args: Array<string>) => Promise<any>

export interface CommandConfiguration {
    name: string
    syntax: string
    desc: string
    triggers: Array<string>
    type: Array<string>
    admin?: boolean
    superadmin?: boolean
    hidden?: boolean
    requireGuild?: boolean
}

export interface CommandInitializer {
    configuration: CommandConfiguration
    executor: CommandExecutor
}

export type CommandType = 'fun' | 'utility' | 'sound' | 'music' | 'image' | 'other' | 'superadmin' | 'admin'

export interface CommandVariants {
    [variant: string]: {
        name: CommandType
        description: string
        emoji: string
    }
}

const commandVariants: CommandVariants = {
    fun: {
        name: 'fun',
        description: 'Fun gadget-esque commands',
        emoji: ':100:'
    },
    utility: {
        name: 'utility',
        description: 'Useful utilites',
        emoji: ':wrench:'
    },
    sound: {
        name: 'sound',
        description: 'Commands that play sound files',
        emoji: ':sound:'
    },
    music: {
        name: 'music',
        description: 'Musicbot commands',
        emoji: ':notes:'
    },
    image: {
        name: 'image',
        description: 'Fun image processing commands',
        emoji: ':frame_photo:'
    },
    admin: {
        name: 'admin',
        description: 'Only for bot administrators',
        emoji: ':crown:'
    },
    other: {
        name: 'other',
        description: 'Commands with miscellaneous functionality',
        emoji: ':grey_question:'
    },
    superadmin: {
        name: 'superadmin',
        description: 'Only for the bot owner',
        emoji: ':exclamation:'
    }
}

const typeNames = Object.keys(commandVariants)

class Command {
    _type: Array<string>
    _hidden: boolean | undefined
    _description: string
    _syntax: string
    _name: string
    _triggers: Array<string>
    _adminCommand: boolean | undefined
    _superadminCommand: boolean | undefined
    _requireGuild: boolean
    _executor: CommandExecutor
    _configuration: CommandConfiguration

    constructor(initializer: CommandInitializer) {
        const { configuration } = initializer
        let types: Array<string> = []
        if (configuration.type) {
            configuration.type.forEach((type) => {
                if (typeNames.indexOf(type.toLowerCase()) === -1) return
                types.push(type.toLowerCase())
            })
        }

        this._type = types.length === 0 ? ['other'] : types

        if (configuration.hidden) {
            this._type = ['hidden']
            this._hidden = true
        }

        this._name = configuration.name
        this._description = configuration.desc
        this._syntax = configuration.syntax
        this._triggers = [...new Set(configuration.triggers)]
        this._adminCommand = configuration.admin
        this._superadminCommand = configuration.superadmin
        this._executor = initializer.executor || initializer.executor
        this._requireGuild = typeof configuration.requireGuild === 'boolean' ? configuration.requireGuild : true

        if (this._adminCommand && !this._type.includes('admin')) {
            this._type.push('admin')
        }
        if (this._superadminCommand && !this._type.includes('superadmin')) {
            this._type.push('superadmin')
        }

        this._configuration = configuration
    }

    get name() {
        return this._name
    }

    get triggers() {
        return this._triggers
    }

    get types() {
        return this._type
    }

    get hidden() {
        return this._hidden
    }

    static variants() {
        return commandVariants
    }

    static isMemberAdminAuthorized(message: Discord.Message): boolean {
        if (!message.member) return false

        if (message.member.hasPermission('ADMINISTRATOR')) return true

        if (AppConfiguration.DISCORD.SUPER_ADMIN_AUTHORIZED.includes(message.author.id)) return true

        return false
    }

    static isMemberSuperAdminAuthorized(message: Discord.Message): boolean {
        return AppConfiguration.DISCORD.SUPER_ADMIN_AUTHORIZED.includes(message.author.id)
    }

    static syntaxEmbed(options: SyntaxEmbedOptions) {
        return SyntaxEmbed(options)
    }

    static createEmbed(): Discord.MessageEmbed {
        return new Discord.MessageEmbed().setColor(0xf4e542)
    }

    unauthorizedAction(message: Discord.Message): void {
        activityLogger.log({
            id: 14,
            content: message.author.username + message.author.discriminator + ' Command: ' + this.name
        })
        message.reply('Sinulla ei ole oikeutta käyttää komentoa ' + this._name)
    }

    async execute(message: Discord.Message, client: Discord.Client, args: Array<string>): Promise<void> {
        if (this._requireGuild && !message.guild) return

        let adminAuthorization = false
        let superadminAuthorization = false

        if (!client || !client.user) return

        if (this._adminCommand) {
            adminAuthorization = Command.isMemberAdminAuthorized(message)
        }

        if (this._superadminCommand) {
            superadminAuthorization = Command.isMemberSuperAdminAuthorized(message)
        }

        if (this._adminCommand && !adminAuthorization) {
            return this.unauthorizedAction(message)
        }

        if (this._superadminCommand && !superadminAuthorization) {
            return this.unauthorizedAction(message)
        }

        this._executor(message, client, args).catch((error) =>
            activityLogger.log({ id: 13, content: this.name, error })
        )
        activityLogger.log({
            id: 12,
            content:
                message.author.username +
                '#' +
                message.author.discriminator +
                ' @ ' +
                message.guild?.name +
                ':' +
                message.guild?.id +
                ' » ' +
                this.name +
                ' ' +
                AppConfiguration.PREFIX +
                args.join(' ')
        })
    }
}

export default Command

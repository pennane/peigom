const config = require('config')
const logger = require('../utilities/activityLogger')

function isObject(o) {
    return typeof o === 'object' && o !== null
}

function isArray(a) {
    return Array.isArray(a)
}

function isFunction(f) {
    return typeof f === "function"
}

let commandtypes = [
    {
        name: 'fun',
        description: 'Fun gadget-esque commands',
        emoji: ':100:'
    },
    {
        name: 'utility',
        description: 'Usefull utilites',
        emoji: ':wrench:'
    },
    {
        name: 'sound',
        description: 'Commands that play sound files',
        emoji: ':sound:'
    },
    {
        name: 'music',
        description: 'Musicbot commands',
        emoji: ':notes:'
    },
    {
        name: 'image',
        description: 'Fun image processing commands',
        emoji: ':frame_photo:'
    },
    {
        name: 'admin',
        description: 'Only for bot administrators',
        emoji: ':crown:'
    },
    {
        name: "other",
        description: "Commands with miscellaneous functionality",
        emoji: ':grey_question:'
    },
    {
        name: "superadmin",
        description: "Only for the bot owner",
        emoji: ':exclamation:'
    }
]

let typenames = commandtypes.map(type => type.name);

class Command {
    constructor({ meta, run }, filename) {
        if (!meta || !isObject(meta)) {
            logger.log(12, { name: filename, reason: "Meta is not present" })
        }
        if (!meta.triggers || !isArray(meta.triggers)) {
            logger.log(12, { name: meta.name, reason: "Triggers are not present" })
        }
        if (!run || !isFunction(run)) {
            logger.log(12, { name: meta.name, reason: "Functionality not present" })
            throw new Error("Command functionality is not present at command '" + meta.name + "'")
        }

        if (meta.type) {
            let types = []
            meta.type.forEach(type => {
                if (typenames.indexOf(type.toLowerCase()) !== -1) {
                    types.push(type.toLowerCase())
                }
            });
            if (types.length !== 0) {
                this.type = types
            } else {
                this.type = ["other"]
            }
        } else {
            this.type = ["other"]
        }

        if (meta.hidden) {
            this.type = ["hidden"]
            this.hidden = true;
        }

        this.name = meta.name
        this.description = meta.desc
        this.adminCommand = meta.admin
        this.superAdminCommand = meta.superadmin
        this.syntax = meta.syntax
        this.triggers = [...new Set(meta.triggers)];

        this.run = run

        if (this.adminCommand && this.type.indexOf('admin') === -1) {
            this.type.push('admin')
        }

        if (this.superAdminCommand === true && this.type.indexOf('superadmin') === -1) {
            this.type.push('superadmin')
        }

        if (this.superAdminCommand && this.type.indexOf('admin') !== -1) {
            let filteredTypes = this.type.filter(type => type !== "admin")
            this.type = filteredTypes
        }

    }

    static commandTypes() {
        return commandtypes
    }

    static adminAuthorized(msg) {
        return (config.get('discord.authorized').indexOf(msg.author.id) > -1 || msg.member.hasPermission('ADMINISTRATOR')) && true
    }

    static superAdminAuthorized(msg) {
        return config.get('discord.authorized').indexOf(msg.author.id) > -1 | false
    }

    exec(msg, client, args) {
        let authorized = false

        if (this.superAdminCommand) {
            authorized = Command.superAdminAuthorized(msg)
        } else if (this.adminCommand) {
            authorized = Command.adminAuthorized(msg)
        } else {
            authorized = true
        }

        if (authorized) {
            this.run(msg, client, args).catch(err => console.info(err))
            logger.log(1, { msg: msg, command: this.name, args: args })
        }
        else {
            this.unauthorized(msg, args)
            logger.log(15, { msg: msg, command: this.name, args: args })
        }
    }
    unauthorized(msg, args) {
        msg.reply("Sinulla ei ole oikeutta käyttää komentoa " + this.name)
    }
}

module.exports = Command;
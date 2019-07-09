const config = require('config')
const logger = require('../utilities/activityLogger')

function isObj(obj) {
    return typeof obj === 'object' && obj !== null
}

function isArr(arr) {
    return Array.isArray(arr)
}

function isFunc(func) {
    return typeof func === "function"
}

class Command {
    constructor({ meta, run }, filename) {
        if (!meta || !isObj(meta)) {
            logger.log(12, {
                name: filename,
                reason: "Meta is not present",
            })
        }
        if (!meta.triggers || !isArr(meta.triggers)) {
            logger.log(12, {
                name:meta.name,
                reason: "Triggers are not present"
            })
        }
        if ( !run || !isFunc(run)) {
            logger.log(12, {
                name:meta.name,
                reason: "Functionality not present"
            })
            throw new Error("Invalid arguments")
        }
        if (!isObj(meta) || !isArr(meta.triggers) || !isFunc(run)) {
            logger.log(12, {
                name:meta.name,
                reason: "Constructor received invalid arguments"
            })
            throw new Error("Invalid arguments")
        }
        this.name = meta.name
        this.description = meta.desc
        this.admin = meta.admin
        this.syntax = meta.syntax
        this.triggers = [...new Set(meta.triggers)];

        this.run = run
    }
    exec(msg, client, args) {
        let authorized = false
        if (this.admin) {
            let authId = config.get('discord.authorized').indexOf(msg.author.id) > -1 | false
            let authRole = msg.member.roles.find(role => role.name === config.discord.authorizedRole[0]) | false
            authorized = (authId || authRole)
        } else {
            authorized = true
        }
        if (authorized) {
            this.run(msg, client, args).catch(err=>console.log(err))
        }
        else this.unauthorized(msg, args)
        logger.log(1, { msg: msg, command: this.name, args: args })
    }
    unauthorized(msg, args) {
        msg.reply("Sinulla ei ole oikeutta käyttää komentoa " + this.name)
    }
}

module.exports = Command;
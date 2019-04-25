const config = require('config')


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
    constructor({ meta, run }) {
        if (!isObj(meta) || !isArr(meta.triggers) || !isFunc(run)) {
            throw new Error("Invalid arguments")
        }
        this.name = meta.name
        this.description = meta.desc
        this.admin = meta.admin
        this.syntax = meta.syntax
        this.triggers = meta.triggers

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
        if (authorized) this.run(msg, client, args)
        else this.unauthorized(msg, args)
    }
    unauthorized(msg, args) {
        msg.reply("Sinulla ei ole oikeutta käyttää komentoa " + this.name)
    }
}

module.exports = Command;
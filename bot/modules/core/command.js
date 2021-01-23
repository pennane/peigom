const CLIENT_CONFIG = require('../utilities/config')
const logger = require('../utilities/activityLogger')

function isObject(o) {
  return typeof o === 'object' && o !== null
}

function isArray(a) {
  return Array.isArray(a)
}

function isFunction(f) {
  return typeof f === 'function'
}

let commandtypes = [
  {
    name: 'fun',
    description: 'Fun gadget-esque commands',
    emoji: ':100:'
  },
  {
    name: 'utility',
    description: 'Useful utilites',
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
    name: 'other',
    description: 'Commands with miscellaneous functionality',
    emoji: ':grey_question:'
  },
  {
    name: 'superadmin',
    description: 'Only for the bot owner',
    emoji: ':exclamation:'
  }
]

let typenames = commandtypes.map((type) => type.name)

class Command {
  constructor({ configuration, executor }, filename) {
    if (!configuration || !isObject(configuration)) {
      logger.log(12, { name: filename, reason: 'configuration is not present' })
    }
    if (!configuration.triggers || !isArray(configuration.triggers)) {
      logger.log(12, { name: configuration.name, reason: 'Triggers are not present' })
    }
    if (!executor || !isFunction(executor)) {
      logger.log(12, { name: configuration.name, reason: 'Functionality not present' })
      throw new Error("Command functionality is not present at command '" + configuration.name + "'")
    }

    if (configuration.type) {
      let types = []
      configuration.type.forEach((type) => {
        if (typenames.indexOf(type.toLowerCase()) !== -1) {
          types.push(type.toLowerCase())
        }
      })
      if (types.length !== 0) {
        this.type = types
      } else {
        this.type = ['other']
      }
    } else {
      this.type = ['other']
    }

    if (configuration.hidden) {
      this.type = ['hidden']
      this.hidden = true
    }

    this.name = configuration.name
    this.description = configuration.desc
    this.adminCommand = configuration.admin
    this.superAdminCommand = configuration.superadmin
    this.syntax = configuration.syntax
    this.triggers = [...new Set(configuration.triggers)]

    this.executor = executor

    if (this.adminCommand && this.type.indexOf('admin') === -1) {
      this.type.push('admin')
    }

    if (this.superAdminCommand === true && this.type.indexOf('superadmin') === -1) {
      this.type.push('superadmin')
    }

    if (this.superAdminCommand && this.type.indexOf('admin') !== -1) {
      let filteredTypes = this.type.filter((type) => type !== 'admin')
      this.type = filteredTypes
    }
  }

  static commandTypes() {
    return commandtypes
  }

  static adminAuthorized(msg) {
    return (
      (CLIENT_CONFIG.DISCORD.AUTHORIZED.indexOf(msg.author.id) > -1 || msg.member.hasPermission('ADMINISTRATOR')) &&
      true
    )
  }

  static superAdminAuthorized(msg) {
    return (CLIENT_CONFIG.DISCORD.AUTHORIZED.indexOf(msg.author.id) > -1) | false
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
      this.executor(msg, client, args).catch((err) => console.info(err))
      logger.log(1, { msg: msg, command: this.name, args: args })
    } else {
      this.unauthorized(msg, args)
      logger.log(15, { msg: msg, command: this.name, args: args })
    }
  }
  unauthorized(msg, args) {
    msg.reply('Sinulla ei ole oikeutta käyttää komentoa ' + this.name)
  }
}

module.exports = Command

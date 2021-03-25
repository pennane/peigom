require('dotenv').config()

let DISCORD_TOKEN = process.env.TOKEN
let YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
let GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN

let APP = {
    VERSION: '2.0.0',
    NAME: 'peigom-bot'
}

let PREFIX = ','

let DISCORD = {
    AUTHORIZED: ['143097697828601857'],
    AUTHORIZED_ROLENAMES: ['peigom-admin'],
    PRESENCE: {
        ACTIVITIES: [
            {
                text: ',auta',
                type: 2
            },
            {
                text: 'my name be jeff',
                type: 0
            },
            {
                text: 'yo big man bom',
                type: 0
            },
            {
                text: '>:^V',
                type: 3
            },
            {
                text: 'sugondese is a funny meme',
                type: 0
            },
            {
                text: 'töis mut ei töis',
                type: 0
            },
            {
                text: 'big, if true',
                type: 3
            },
            {
                text: 'documentaries',
                type: 3
            },
            {
                text: 'smooth swing jazz',
                type: 2
            },
            {
                text: 'your conversation',
                type: 2
            },
            {
                text: 'pimpeli pom, nimi o peigom',
                type: 0
            },
            {
                text: 'Playing',
                type: 0
            }
        ],
        REFRESH_RATE: 30
    }
}

let COMMAND_SPAM_PROTECTION = {
    STATE: true,
    AMOUNT_OF_COMMANDS: 4,
    AMOUNT_OF_SECONDS: 12
}

let LOG_USED_COMMANDS = true

if (process.env.NODE_ENV === 'development') {
    PREFIX = '-'
    LOG_USED_COMMANDS = true
}

module.exports = {
    APP,
    COMMAND_SPAM_PROTECTION,
    LOG_USED_COMMANDS,
    DISCORD_TOKEN,
    YOUTUBE_API_KEY,
    GENIUS_ACCESS_TOKEN,
    DISCORD,
    PREFIX
}

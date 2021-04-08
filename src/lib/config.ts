import dotenv from 'dotenv'
import Discord from 'discord.js'
dotenv.config()

let DISCORD_TOKEN = process.env.TOKEN
let YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
let GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN

let APP = {
    VERSION: '4.0.0',
    NAME: 'Peigom'
}

let PREFIX = ','

interface Activity {
    text: string
    type: Discord.ActivityType
}

let activities: Activity[] = [
    // {
    //     text: ',auta',
    //     type: 'LISTENING'
    // },
    // {
    //     text: 'my name be jeff',
    //     type: 'PLAYING'
    // },
    // {
    //     text: 'yo big man bom',
    //     type: 'PLAYING'
    // },
    // {
    //     text: '>:^V',
    //     type: 'WATCHING'
    // },
    {
        text: 'Borat on Amazon Prime',
        type: 'STREAMING'
    }
    // {
    //     text: 'sugondese is a funny meme',
    //     type: 'PLAYING'
    // },
    // {
    //     text: 'töis mut ei töis',
    //     type: 'PLAYING'
    // },
    // {
    //     text: 'big, if true',
    //     type: 'WATCHING'
    // },
    // {
    //     text: 'competing',
    //     type: 'COMPETING'
    // },
    // {
    //     text: 'pullava',
    //     type: 'WATCHING'
    // },
    // {
    //     text: 'documentaries',
    //     type: 'WATCHING'
    // },
    // {
    //     text: 'smooth swing jazz',
    //     type: 'LISTENING'
    // },
    // {
    //     text: 'your conversation',
    //     type: 'LISTENING'
    // },
    // {
    //     text: 'pimpeli pom, nimi o peigom',
    //     type: 'PLAYING'
    // },
    // {
    //     text: 'Playing',
    //     type: 'PLAYING'
    // }
]

let DISCORD = {
    SUPER_ADMIN_AUTHORIZED: ['143097697828601857'],
    PRESENCE: {
        ACTIVITIES: activities,
        REFRESH_RATE: 30
    }
}

let COMMAND_SPAM_PROTECTION = {
    STATE: true,
    AMOUNT_OF_COMMANDS: 4,
    AMOUNT_OF_SECONDS: 12
}

let LOG_USED_COMMANDS = false

if (process.env.NODE_ENV === 'development') {
    PREFIX = '-'
    LOG_USED_COMMANDS = true
}

export {
    APP,
    COMMAND_SPAM_PROTECTION,
    LOG_USED_COMMANDS,
    DISCORD_TOKEN,
    YOUTUBE_API_KEY,
    GENIUS_ACCESS_TOKEN,
    DISCORD,
    PREFIX
}

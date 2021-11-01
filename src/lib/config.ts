import dotenv from 'dotenv'
import Discord from 'discord.js'
dotenv.config()

let DISCORD_TOKEN = process.env.TOKEN
let YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

let APP = {
    VERSION: '4.0.0',
    NAME: 'Peigom'
}

let PREFIX = ','

export interface ClientActivity {
    text: string
    type: Discord.ActivityType
}

let activities: ClientActivity[] = [
    {
        text: '4D Chess',
        type: 'COMPETING'
    },
    {
        text: 'presidency',
        type: 'COMPETING'
    },
    {
        text: ',auta',
        type: 'LISTENING'
    },
    {
        text: 'Niinistö dab',
        type: 'WATCHING'
    },
    {
        text: 'Borat on Amazon Prime',
        type: 'STREAMING'
    },
    {
        text: 'Fortnite',
        type: 'STREAMING'
    },
    {
        text: 'sugondese is still a funny meme',
        type: 'PLAYING'
    },
    {
        text: 'Fröbelin palikat',
        type: 'LISTENING'
    },
    {
        text: PREFIX + 'pussukat',
        type: 'LISTENING'
    },
    {
        text: 'pullava',
        type: 'WATCHING'
    },
    {
        text: 'documentaries',
        type: 'WATCHING'
    },
    {
        text: 'smooth jazz',
        type: 'LISTENING'
    },
    {
        text: 'your conversation',
        type: 'LISTENING'
    }
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

export { APP, COMMAND_SPAM_PROTECTION, LOG_USED_COMMANDS, DISCORD_TOKEN, YOUTUBE_API_KEY, DISCORD, PREFIX }

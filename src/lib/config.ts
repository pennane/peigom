import Discord from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const DISCORD_TOKEN = process.env.TOKEN
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

const APP = {
  VERSION: '4.0.0',
  NAME: 'Peigom'
}

let PREFIX = ','

export interface ClientActivity {
  text: string
  type: Exclude<Discord.ActivityType, 'CUSTOM'>
}

const activities: ClientActivity[] = [
  {
    text: '4D Chess',
    type: Discord.ActivityType.Competing
  },
  {
    text: 'presidency',
    type: Discord.ActivityType.Competing
  },
  {
    text: ',auta',
    type: Discord.ActivityType.Listening
  },
  {
    text: 'Niinistö dab',
    type: Discord.ActivityType.Watching
  },
  {
    text: 'Borat on Amazon Prime',
    type: Discord.ActivityType.Streaming
  },
  {
    text: 'Fortnite',
    type: Discord.ActivityType.Streaming
  },
  {
    text: 'sugondese is still a funny meme',
    type: Discord.ActivityType.Playing
  },
  {
    text: 'Fröbelin palikat',
    type: Discord.ActivityType.Listening
  },
  {
    text: PREFIX + 'pussukat',
    type: Discord.ActivityType.Listening
  },
  {
    text: 'pullava',
    type: Discord.ActivityType.Watching
  },
  {
    text: 'documentaries',
    type: Discord.ActivityType.Watching
  },
  {
    text: 'smooth jazz',
    type: Discord.ActivityType.Listening
  },
  {
    text: 'your conversation',
    type: Discord.ActivityType.Listening
  }
]

const DISCORD = {
  SUPER_ADMIN_AUTHORIZED: ['143097697828601857'],
  PRESENCE: {
    ACTIVITIES: activities,
    REFRESH_RATE: 30
  }
}

const COMMAND_SPAM_PROTECTION = {
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
  DISCORD,
  DISCORD_TOKEN,
  LOG_USED_COMMANDS,
  PREFIX,
  YOUTUBE_API_KEY
}

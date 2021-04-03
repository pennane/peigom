import { COMMAND_SPAM_PROTECTION } from './config'
import Discord from 'discord.js'

interface UserHistory {
    timestamps: number[]
}

interface AllowedState {
    allowed: boolean
}
interface DeniedState {
    allowed: boolean
    remaining: number
}

let cache: Map<string, UserHistory> = new Map()

const SpamProtection = (user: Discord.User): AllowedState | DeniedState => {
    let AMOUNT_OF_COMMANDS = COMMAND_SPAM_PROTECTION.AMOUNT_OF_COMMANDS
    let AMOUNT_OF_SECONDS = COMMAND_SPAM_PROTECTION.AMOUNT_OF_SECONDS

    let now = Date.now()

    let userHistory = cache.get(user.id)

    let state

    if (!userHistory) {
        cache.set(user.id, { timestamps: [now] })
        state = { allowed: true }
        return state
    }

    if (!userHistory.timestamps[AMOUNT_OF_COMMANDS - 1]) {
        userHistory.timestamps.unshift(now)
        state = { allowed: true }
    } else if (now - userHistory.timestamps[AMOUNT_OF_COMMANDS - 1] > AMOUNT_OF_SECONDS * 1000) {
        userHistory.timestamps.unshift(now)
        state = { allowed: true }
    } else {
        state = { allowed: false, remaining: 10000 - (now - userHistory.timestamps[2]) }
    }

    while (userHistory.timestamps[AMOUNT_OF_COMMANDS]) {
        userHistory.timestamps.pop()
    }

    return state
}

export default SpamProtection

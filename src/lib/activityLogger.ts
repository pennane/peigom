import fs from 'fs'
import * as AppConfiguration from './config'
import c from 'chalk'

/*
0 Client Connected
1 Client Reconnected

11 Command failed to load
12 Command Used
13 Command Use failure
14 Command Unauthorized

20 New Server
21 Server Removed

31 Error in process
32 Error in discord client
33 Error in utilities / core
*/

const ensureFiles = ({ year, month, day, error }: { year: string; month: string; day: string; error?: boolean }) => {
    if (!fs.existsSync(`./log/${year}`)) fs.mkdirSync(`./log/${year}`)
    if (!fs.existsSync(`./log/${year}/${month}`)) fs.mkdirSync(`./log/${year}/${month}`)

    if (!error && !fs.existsSync(`./log/${year}/${month}/${day}.txt`))
        fs.writeFileSync(`./log/${year}/${month}/${day}.txt`, `Logs from ${day}.${month}.${year}\n\n`)

    if (error && !fs.existsSync(`./log/${year}/${month}/${day}.error.txt`))
        fs.writeFileSync(`./log/${year}/${month}/${day}.error.txt`, `Logs from ${day}.${month}.${year}\n\n`)
}

const getDateParts = () => {
    let date = new Date()
    let year = String(date.getFullYear())
    let month = String(date.getMonth() + 1).padStart(2, '0')
    let day = String(date.getDate()).padStart(2, '0')
    let hour = String(date.getHours()).padStart(2, '0')
    let minute = String(date.getMinutes()).padStart(2, '0')
    let second = String(date.getSeconds()).padStart(2, '0')

    return { date, year, month, day, hour, minute, second }
}

const saveActivity = (message: string) => {
    let { year, month, day } = getDateParts()

    ensureFiles({ year, month, day })
    fs.appendFileSync(`./log/${year}/${month}/${day}.txt`, message)
}

const saveError = (message: string) => {
    let { year, month, day } = getDateParts()

    ensureFiles({ year, month, day, error: true })
    fs.appendFileSync(`./log/${year}/${month}/${day}.error.txt`, message)
}

const shortDate = (): string => {
    let { hour, minute } = getDateParts()
    return `${hour}:${minute}`
}

const longDate = (): string => {
    let { day, month, hour, minute } = getDateParts()
    return `${day}.${month} ${hour}:${minute}`
}

const buildMessage = ({
    id,
    title,
    content,
    error
}: {
    id: number
    title: string
    content?: string
    error?: Error
}) => {
    return `${shortDate()} »〔${id}:${title}〕${content ? ` » ${content}` : ''}${
        error?.name ? ` » '${error.name}'` : ''
    }${error?.message ? `: '${error.message}'` : ''}${error?.stack ? ` » '${error.stack}'` : ''}\n`
}

export const log = ({ id, content, error }: { id: number; content?: string; error?: Error }) => {
    // Return if config has been set to not log commands
    let isCommandId = id === 12 || id === 14
    if (isCommandId && !AppConfiguration.LOG_USED_COMMANDS) return

    let message: string

    switch (id) {
        case 0: {
            message = buildMessage({ id, title: 'Client Connected' })
            break
        }
        case 1: {
            message = buildMessage({ id, title: 'Client Reconnected' })
            break
        }
        case 11: {
            console.info(
                c.bgBlack(longDate()) + ': ' + c.yellow('Command initiation failed') + ' ' + c.redBright(content)
            )
            message = buildMessage({ id, title: 'Command initiation failed', content, error })
            break
        }
        case 12: {
            message = buildMessage({ id, title: 'Command used', content })
            break
        }
        case 13: {
            message = buildMessage({ id, title: 'Command failed on use', content, error })
            break
        }
        case 14: {
            message = buildMessage({ id, title: 'Unauthorized command use', content })
            break
        }
        case 15: {
            message = buildMessage({ id, title: 'Tried to fuck shit seriously up', content })
            break
        }
        case 20: {
            console.info(
                c.bgBlack(longDate()) + ': ' + c.greenBright('Bot added to new guild') + ' ' + c.redBright(content)
            )
            message = buildMessage({ id, title: 'Bot added to new guild', content })
            break
        }
        case 21: {
            console.info(
                c.bgBlack(longDate()) + ': ' + c.yellowBright('Bot added to new guild') + ' ' + c.redBright(content)
            )
            message = buildMessage({ id, title: 'Bot removed from guild', content })
            break
        }
        case 31: {
            console.info(c.bgBlack(longDate()) + ': ' + c.red('Error in the process'))
            message = buildMessage({ id, title: 'Error in the process', error })
            break
        }
        case 32: {
            console.info(c.bgBlack(longDate()) + ': ' + c.red('Error in the discord client'))
            message = buildMessage({ id, title: 'Error in the discord client', error })
            break
        }
        case 33: {
            console.info(c.bgBlack(longDate()) + ': ' + c.red('Error in utilities / core'))
            message = buildMessage({ id, title: 'Error in utilities / core', error })
            break
        }

        default:
            return
    }

    if (error) {
        saveError(message)
    } else {
        saveActivity(message)
    }
}

const ActivityLogger = {
    log
}
export default ActivityLogger

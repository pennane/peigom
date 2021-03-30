import chalk from 'chalk'

/*
         Table for mode numbers:
             1: Discord Command; User used a commmand.
             2: Client Connected; Client connected succesfully.
             3: Client Error; Something happened at the websocket.
             4: Client Reconnecting; Client started to reconnect.
             5: Client Reconnected; Client reconnect succesfully.
             6: Discord Command Failure; Command failed.
             7: New member; a new member joined a server.
             8: Member left; member left from a server.
             9: New server; bot added to a new server.
             10: Server removed; bot removed from a server.
             11: Command load failure; command failed to initialize.
             12: Faulty command; command does not follow the command class.
             13: Command failure with stack; fail at command and stack exists.
             14: Command failed on use
             15: Discord Command; User tried to use an unauthorized commmand.
*/

const log = (id: number, content?: any) => {
    if (id === 3 && content) {
        console.log(chalk.red(content))
        return
    }
    console.log(chalk.yellowBright('LOG: ' + id))
}

const ActivityLogger = { log }

export default ActivityLogger

const fs = require('fs');
const chalk = require('chalk')

const time = require('./getTime');




module.exports.log = (mode, content) => {
    return new Promise((resolve, reject) => {
        if (!mode === parseInt(mode, 10)) throw new Error("Error: Received activity mode is not an integer!");

        let today = time.get(),
            todayPrecise = time.get(1),
            yyyy = time.yyyy(),
            mm = time.mm(),
            dd = time.dd(),
            hh = time.hh(),
            m = time.m(),
            ss = time.ss();

        let filenm = `./log/${yyyy}/${mm}/${dd}.txt`;

        if (!fs.existsSync(`./log/${yyyy}`)) fs.mkdirSync(`./log/${yyyy}`);
        if (!fs.existsSync(`./log/${yyyy}/${mm}`)) fs.mkdirSync(`./log/${yyyy}/${mm}`);
        if (!fs.existsSync(`./log/${yyyy}/${mm}/${dd}.txt`)) fs.writeFileSync(`./log/${yyyy}/${mm}/${dd}.txt`, `Logs from ${dd}.${mm}.${yyyy}`);

        let msgtolog = "";

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
 */

        let modes = {
            1: () => { /* Discord Command */
                msgtolog = `\r\n[Command] User: ${content.msg.author.username}, ${content.msg.author.id} Command: ${content.command} Args: ${content.args} Where: @${content.msg.channel.guild.name}:${content.msg.channel.guild.id}#${content.msg.channel.name} When: ${content.msg.createdTimestamp}`;
            },
            2: () => { /* Client Connected */
                msgtolog = `\r\n[Connected @ ${todayPrecise}] `;
            },
            3: () => { /* Client Error */
                msgtolog = `\r\n[Error @ ${todayPrecise}]\r\n${content}\r\n${content.stack ? content.stack : "no error stack"}\n[ ---------- ]`;
                console.info(chalk.red(`|-- ${time.get(1)} > Error has happended in the ${chalk.yellow("client")}, check ${chalk.white("./log/")}`))
            },
            4: () => { /* Client Reconnecting */
                msgtolog = `\r\n[Reconnecting @ ${todayPrecise}]`;
                console.info(chalk.orange(`|-- ${time.get(1)} > Reconnecting to websocket..`))
            },
            5: () => { /* Client Reconnected */
                msgtolog = `\r\n[Resumed @ ${todayPrecise}]`;
                console.info(chalk.green(`|-- ${time.get(1)} > Reconnected successfully`))
            },
            6: () => { /* Discord Command Failure */
                msgtolog = `\r\n[Command Failed] User: ${content.msg.author.username}: ${content.msg.author.id} Command: ${content.command} Args: ${content.args} Where: @${content.msg.channel.guild.name}#${content.msg.channel.name} When: ${content.msg.createdTimestamp}`;
            },
            7: () => { /* New Member at Server x */
                msgtolog = `\r\n[New member] User ${content.user.username}: ${content.id} Where: ${content.guild.name}:${content.guild.id} When: ${todayPrecise}`;
                console.info(chalk.gray("|-- New member on " + member.guild.name + ":" + member.guild.id + ", " + member.user.username + ":" + member.user.id))
            },
            8: () => { /* Member Left from Server x */
                msgtolog = `\r\n[Member left] User ${content.user.username}: ${content.id} Where: ${content.guild.name}:${content.guild.id} When: ${todayPrecise}`;
                console.info(chalk.gray("|-- Member left from " + member.guild.name + ":" + member.guild.id + ", " + member.user.username + ":" + member.user.id))
            },
            9: () => { /* Client joined a New Server */
                msgtolog = `\r\n[New server] Server: ${content.name}:${content.id} When: ${todayPrecise}`;
                console.info(chalk.gray(`|-- New guild joined: ${guild.name}:${guild.id}. This guild has ${guild.memberCount} members.`))
            },
            10: () => { /* Server Removed from Client */
                msgtolog = `\r\n[Removed server] Server: ${content.name}:${content.id} When: ${todayPrecise}`;
                console.info(chalk.gray(`|-- Bot removed from: ${guild.name}:${guild.id}`))
            },
            11: () => { /* Command Failed to Load */
                msgtolog = `\r\n[Failed command] Command '${content}' failed to load`
                console.info(chalk.red(`|-- Command ${chalk.yellow(content)} failed to load. Check ${chalk.white("./log/")} for more`))
            },
            12: () => { /* Faulty command */
                msgtolog = `\r\n[Invalid command] Failed command: ${content.name}. Reason: ${content.reason}`
                console.info(chalk.red(`|-- Command ${chalk.yellow(content.name)} failed to construct itself. Check ${chalk.white("./log/")} for more`))
            },
            13: () => { /* Command Failed with stack */
                msgtolog = `\r\n[Faulty command file] '${content.file}' failed to load. \r\n ${content.err} \r\n ${content.stack}`
                console.info(chalk.red(`|-- File ${chalk.yellow(content.file)} failed to load. Check ${chalk.white("./log/")} for more`))
            }
        }


        

        if (modes[mode]) {
            modes[mode]();
            fs.appendFileSync(filenm, msgtolog, (err) => {
                if (err) throw err;
            });
        } else {
            throw new Error("Error: Received activity mode does not exist.");
        }
        resolve();
    });
}
process.on('uncaughtException', error => {
    module.exports.log(3, error)
        .catch(error => console.info(error));
    console.info(chalk.red(`|-- ${time.get(1)} > Error has happended in the process, check ${chalk.white("./log/")}`));
});
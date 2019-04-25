const fs = require("fs");
const time = require("./get-time.js");

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
        let modes = {
            1: () => { /* Discord Command */
                msgtolog = `\r\n[Command] User: ${content.msg.author.username}, ${content.msg.author.id} Command: ${content.command} Args: ${content.args} Where: @${content.msg.channel.guild.name}:${content.msg.channel.guild.id}#${content.msg.channel.name} When: ${content.msg.createdTimestamp}`;
            },
            2: () => { /* Client Connected */
                msgtolog = `\r\n[Connected @ ${todayPrecise}] `;
            },
            3: () => { /* Client Error */
                msgtolog = `\r\n[Error @ ${todayPrecise}]\r\n${content}\r\n${content.stack ? content.stack : "no error stack"}\n[ ---------- ]`;
            },
            4: () => { /* Client Reconnecting */
                msgtolog = `\r\n[Reconnecting @ ${todayPrecise}]`;
            },
            5: () => { /* Client Reconnected */
                msgtolog = `\r\n[Resumed @ ${todayPrecise}]`;
            },
            6: () => { /* Discord Command Failure */
                msgtolog = `\r\n[Command Failed] User: ${content.msg.author.username}: ${content.msg.author.id} Command: ${content.command} Args: ${content.args} Where: @${content.msg.channel.guild.name}#${content.msg.channel.name} When: ${content.msg.createdTimestamp}`;
            },
            7: () => { /* New Member at Server x */
                msgtolog = `\r\n[New member] User ${content.user.username}: ${content.id} Where: ${content.guild.name}:${content.guild.id} When: ${todayPrecise}`;
            },
            8: () => { /* Member Left from Server x */
                msgtolog = `\r\n[Member left] User ${content.user.username}: ${content.id} Where: ${content.guild.name}:${content.guild.id} When: ${todayPrecise}`;
            },
            9: () => { /* Client joined a New Server */
                msgtolog = `\r\n[New server] Server: ${content.name}:${content.id} When: ${todayPrecise}`;
            },
            10: () => { /* Server Removed from Client */
                msgtolog = `\r\n[Removed server] Server: ${content.name}:${content.id} When: ${todayPrecise}`;
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
        .catch(error => console.log(error));
    console.log(chalk.red(`|-- ${time.get(1)} > Error has happended in the process, check ./log/`));
});
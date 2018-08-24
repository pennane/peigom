const fs = require("fs");
const _ = require("underscore");

const time = require("./get-time.js");

var exports = module.exports = {};
exports.log = function (mode, content) {
    return new Promise((resolve, reject) => {
        if (!mode === parseInt(mode, 10)) {
            throw new Error("Error: Received activity mode is not an integer!")
        }
        var today = time.get();
        var todayPrecise = time.get(1);
        var yyyy = time.yyyy();
        var mm = time.mm();
        var dd = time.dd();
        var hh = time.hh();
        var m = time.m();
        var ss = time.ss();

        var filenm = `./log/${yyyy}/${mm}/${dd}.txt`;

        if (!fs.existsSync(`./log/${yyyy}`)) {
            fs.mkdirSync(`./log/${yyyy}`)
        }
        if (!fs.existsSync(`./log/${yyyy}/${mm}`)) {
            fs.mkdirSync(`./log/${yyyy}/${mm}`)
        }
        if (!fs.existsSync(`./log/${yyyy}/${mm}/${dd}.txt`)) {
            fs.writeFileSync(`./log/${yyyy}/${mm}/${dd}.txt`)
        }

        if (mode === 1) { // Command
            var msgtolog = `\r\n[Command] User: ${content.msg.author.username}, ${content.msg.author.id} Command: ${content.command} Args: ${content.args} Where: @${content.msg.channel.guild.name}#${content.msg.channel.name} When: ${content.msg.createdTimestamp}`;
            fs.appendFileSync(filenm, msgtolog, function (err) {
                if (err) throw err;
            });
        } else if (mode === 2) { // Connect
            var msgtolog = `\r\n[Connected @ ${todayPrecise}] `;
            fs.appendFileSync(filenm, msgtolog, function (err) {
                if (err) throw err;
            });
        } else if (mode === 3) { // Error
            var msgtolog = `\r\n[Error @ ${todayPrecise}]\r\n${content}\r\n[ ---------- ]`;
            fs.appendFileSync(filenm, msgtolog, function (err) {
                if (err) throw err;
            });
        } else if (mode === 4) { // Reconnecting
            var msgtolog = `\r\n[Reconnecting @ ${todayPrecise}]`;
            fs.appendFileSync(filenm, msgtolog, function (err) {
                if (err) throw err;
            });
        } else if (mode === 5) { // Reconnect succeeds
            var msgtolog = `\r\n[Resumed @ ${todayPrecise}]`;
            fs.appendFileSync(filenm, msgtolog, function (err) {
                if (err) throw err;
            });
        } else if (mode === 6) { // Failed command
            var msgtolog = `\r\n[Command Failed] User: ${content.msg.author.username}, ${content.msg.author.id} Command: ${content.command} Args: ${content.args} Where: @${content.msg.channel.guild.name}#${content.msg.channel.name} When: ${content.msg.createdTimestamp}`;
            fs.appendFileSync(filenm, msgtolog, function (err) {
                if (err) throw err;
            });
        } 
        else {
            throw new Error("Error: Received activity mode does not exist.");
        }
            resolve();
    });
}
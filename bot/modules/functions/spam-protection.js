const schedule = require('node-schedule');
const Discord = require('discord.js');
const _ = require('underscore');

let com_interval = 5 //seconds
let gen_interval = 3 //seconds

var exports = module.exports = {};
exports.check = (client, user, command) => {
    return new Promise((resolve, reject) => {
        let allowed = true;
        let type = null;
        let waittime = null;
        let now = Date.now();

        if (!client || !user || !command) {
            reject(new Error("Did not receive required arguments"))
        }
        if (!_.isObject(client) || !_.isObject(user)) {
            reject(new Error("Received faulty arguments"))
        }
        let userid = user.id;

        if (!client.spam.users[userid]) {
            client.spam.users[userid] = {
                command: {},
                info: {
                    name: user.username,
                    id: user.id
                },
                lasttime: false
            }
        }

        let userobj = client.spam.users[userid];

        if (!userobj.command[command]) {
            userobj.command[command] = {
                lasttime: false
            }
        }


        function test() {
            if ((userobj.command[command].lasttime) && ((now - userobj.command[command].lasttime) < (com_interval * 1000))) {
                allowed = false;
                type = "command";
                waittime = ((com_interval * 1000) - (now - userobj.command[command].lasttime)) / 1000;
                waittime = parseInt(waittime);
                return false;
            } else if ((userobj.lasttime) && ((now - userobj.lasttime) < (gen_interval * 1000))) {
                allowed = false;
                type = "general";
                waittime = ((gen_interval * 1000) - (now - userobj.lasttime)) / 1000;
                waittime = parseInt(waittime);
                return false;
            }
        }


        if (test() !== false) {
            userobj.command[command].lasttime = now;
            userobj.lasttime = now;
        }

        if (!userobj.command[command].lasttime) {
            userobj.command[command].lasttime = now
        }

        if (!userobj.lasttime) {
            userobj.lasttime = now
        }
        
        resolve({ allowed: allowed, type: type, waittime: waittime })

    });
}
const config = require('config');
let spamData = { users: {} }

module.exports.check = (user, command) => {
    return new Promise((resolve, reject) => {
        let state = config.misc.commandspamprotection.state;
        if (state === false) {
            return resolve({allowed:true});
        }
        let com_interval = config.misc.commandspamprotection.com_interval // seconds
        let gen_interval = config.misc.commandspamprotection.gen_interval // seconds
        let allowed = true;
        let type = null;
        let waittime = null;
        let now = Date.now();

        if (!user || !command) {
            reject(new Error("Did not receive required arguments"))
        }

        let userid = user.id;

        if (!spamData.users[userid]) {
            spamData.users[userid] = {
                command: {},
                info: {
                    name: user.username,
                    id: user.id
                },
                lasttime: false
            }
        }

        let userobj = spamData.users[userid];

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
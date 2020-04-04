const config = require('config');
let cachedMessageData = new Map()

module.exports.check = (user, command) => {
    return new Promise((resolve, reject) => {

        if (!user || !command) {
            reject(new Error("Did not receive required arguments"))
        }

        // How many commands can be sent in how many seconds
        let AMOUNT_OF_COMMANDS = config.COMMAND_SPAM_PROTECTION.AMOUNT_OF_COMMANDS
        let AMOUNT_OF_SECONDS = config.COMMAND_SPAM_PROTECTION.AMOUNT_OF_SECONDS

        let now = Date.now();

        let userData = cachedMessageData.get(user.id);

        if (!userData) {
            cachedMessageData.set(user.id, {
                previousTimestamps: [now]
            })
            return resolve({ allowed: true })
        }

        if (!userData.previousTimestamps[AMOUNT_OF_COMMANDS - 1]) {
            userData.previousTimestamps.unshift(now)
            resolve({ allowed: true })
        } else if (now - userData.previousTimestamps[AMOUNT_OF_COMMANDS - 1] > AMOUNT_OF_SECONDS * 1000) {
            userData.previousTimestamps.unshift(now)
            resolve({ allowed: true })
        } else {
            resolve({ allowed: false, remaining: 10000 - (now - userData.previousTimestamps[2]) })
        }

        while (userData.previousTimestamps[AMOUNT_OF_COMMANDS]) {
            userData.previousTimestamps.pop()
        }
    });
}
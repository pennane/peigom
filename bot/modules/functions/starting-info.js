var exports = module.exports = {};
exports.set = function (client) {
    console.info(`Logged in as ${client.user.tag}!`);
    if (!client.timing.completed) {
        console.timeEnd("| Connecting");
        client.timing.completed = true;
    }
    
    console.info(`| Loaded: ${Object.keys(client.CommandExecutor.commands).length} commands`);
    console.info(`| Loaded: ${Object.keys(client.usrdata.users).length} users with ${client.config.get("discord.prefix")}raha`);
    console.info(`| Loaded: ${client.config.misc.badwords.length} forbidden words`);
    if (client.config.get("misc.devmode") === true) {
        console.info(`| Dev mode: true`);
    }
    var date = new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
}
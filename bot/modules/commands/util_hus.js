const configuration = {
    name: "hus",
    admin: false,
    syntax: "hus",
    desc: "Heittää botin pois äänikanavalta.",
    triggers: ["hus"],
    type: ["utility"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (msg.guild.voiceConnection) {
            if (msg.guild.voiceConnection.dispatcher) {
                msg.guild.voiceConnection.dispatcher.end();
            }

        }
        if (msg.guild.me.voice.channel) {
            msg.guild.me.voice.channel.leave();
        }
        resolve();
    });
}

module.exports.configuration = configuration;
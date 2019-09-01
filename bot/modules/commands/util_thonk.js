const meta = {
    name: "thonk",
    admin: false,
    syntax: "thonk",
    desc: "Lähettää kanavalle animoidun thonkin.",
    triggers: ["thonk"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        if (client.emojis.has("443343009229045760") && (msg.guild.emojis.has("443343009229045760") || msg.channel.permissionsFor(msg.guild.me).has("USE_EXTERNAL_EMOJIS"))) {
            msg.channel.send('<a:thonk:443343009229045760>')
                .catch(err => console.info(err))
        } else {
            msg.channel.send(':thinking:')
                .catch(err => console.info(err));
        }
        resolve();
    });
}

module.exports.meta = meta;

const animation = require('../../data/animation.json');

var info = {
    name: "animation",
    admin: false,
    syntax: "animation <animaation nimi tai lista>",
    desc: "Toistaa käyttäjän antaman animaation"
}

module.exports = exports = {};

exports.run = function (msg, client, args) {
    var syntax = info.syntax;
    if (args.length > 1) {
        if (animation[args[1]]) {
            msg.channel.send(animation[args[1]].keyframes[0]).then(msg => {
                for (frame in animation[args[1]].keyframes) {
                    (function (frame) {

                        if (!(frame === animation[args[1]].keyframes[0])) {
                            setTimeout(function () {
                                msg.edit(animation[args[1]].keyframes[frame]), animation[args[1].delay];
                            }, animation[args[1]].delay * frame);
                        }

                    })(frame);
                }
            }).catch(error => console.info(error));
        } else {
            var str = Object.keys(animation);
            msg.channel.send("Lista saatavailla olevista animaatioista:```" + str + "```");
        }
    } else {
        msg.channel.send(syntax);
    }
}

exports.info = info;
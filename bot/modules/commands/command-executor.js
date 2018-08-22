const _ = require("underscore");
const ffmpeg = require("ffmpeg");
const fs = require("fs");
const http = require('https');

var exports = module.exports = {};
var IsBusy = false;


exports.parse = function (client, msg, command, args) {
    return new Promise((resolve, reject) => {

        if (!_.isObject(client) || !_.isObject(msg)) {
            throw new Error("Invalid arguments");
        }

        var usrdata = JSON.parse(fs.readFileSync('./data/user-data.json', 'utf8'));
        var animation = JSON.parse(fs.readFileSync('./data/animation.json', 'utf8'));
        var commands = client.config.get('commands');
        var prefix = client.config.get("discord.prefix");
        runCommand(msg, command, args);

        function runCommand(msg, command, args) {
            switch (command) {
                case ("editme"):
                    commandEditme(msg, args);
                    break;
                case ("help"):
                case ("auta"):
                    commandAuta(msg, args);
                    break;
                case "thonk":
                    commandThonk(msg, args);
                    break;
                case "uptime":
                    commandUptime(msg, args);
                    break;
                case "dankmeme":
                    commandDankmeme(msg, args);
                    break;
                case "oof":
                    commandOof(msg, args);
                    break;
                case "tomb":
                    commandTomb(msg, args);
                    break;
                case "pussukat":
                    commandPussukat(msg, args);
                    break;
                case "hus":
                    commandHus(msg, args);
                    break;
                case "ping":
                case "pong":
                    commandPing(msg, args);
                    break;
                case "raha":
                    commandMoney(msg, args);
                    break;
                case "busy":
                    commandBusy(msg, args);
                    break;
                case "sudo":
                    commandSudo(msg, args);
                    break;
                case "sudopm":
                    commandSudopm(msg, args);
                    break;
                case "restart":
                    commandRestart(msg, args);
                    break;
                case "sammuta":
                    commandSammuta(msg, args);
                    break;
                case "spam":
                    commandSpam(msg, args);
                    break;
                case "puhista":
                case "puhdista":
                    commandPuhista(msg, args);
                    break;
                case "animation":
                    commandAnimation(msg, args);
                    break;
                default:

                    break;
            }
        }

        function getCommandSyntax(subcommand) {
            var syntax;
            var syntaxhelp;
            if (subcommand !== undefined && commands[command].sub[subcommand]) {
                syntax = commands[command].sub[subcommand].syntax;
                syntaxhelp = 'Komento toimii näin:```' + syntax + '```';
            } else if (subcommand === undefined && commands[command] && !subcommand) {
                syntax = commands[command].syntax;
                syntaxhelp = 'Komento toimii näin:```' + syntax + '```';
            }
            return syntaxhelp;
        }

        function playSound(filename, msg, connection) {
            var dispatcher = connection.playFile(filename);
            dispatcher.on("end", end => {
                IsBusy = false;
                msg.member.voiceChannel.leave();
            });
        }

        function commandAuta(msg, args) {

            var syntax = getCommandSyntax();
            if (!args[1]) {
                var cmds = '';
                var acmds = '';
                for (var i = 0; i < Object.keys(commands)
                    .length; i++) {
                    var obj = Object.keys(commands)[i];
                    if (commands[obj].admin) {
                        acmds += '\n' + prefix + Object.keys(commands)[i];
                    } else {
                        cmds += '\n' + prefix + Object.keys(commands)[i];
                    }
                }
                var cmdsay = 'Komentojen prefix on: `' + prefix + '`\nKaikki komennot o: ```' + cmds + '```\nKaikki admin komennot o: ```' + acmds + '```\nLisätietoa tietystä komennosta:\n```' + prefix + 'auta <komennon nimi>```';
                msg.channel.send(cmdsay)
                    .then(msg => {
                        msg.delete(180000)
                    })
                    .catch(error => console.log(error));
            }
            if (args[1]) {
                var objkey = args[1]
                if (commands[args[1]]) {
                    var tosend = 'Komento toimii näin:```' + commands[args[1]].syntax + '```Komennon toiminto:```' + commands[args[1]].desc + '```';
                    msg.channel.send(tosend)
                        .then(msg => {
                            /*msg.delete(15000)*/
                        })
                        .catch(error => console.log(error));
                }
            }
        }

        function commandMoney(msg, args) {
            var daily = 250;
            var syntax = getCommandSyntax();
            if (!msg.author.bot) {
                var userid = msg.author.id.toString();
                var usrobj;

                function userCheck() {
                    for (var i = 0; i < usrdata.users.length; i++) {
                        if (usrdata.users[i].id == userid) {
                            usrobj = usrdata.users[i];
                            return true;
                        }
                    }
                }
                if (usrdata.users[msg.author.id]) {
                    usrobj = usrdata.users[msg.author.id];
                } else {
                    usrdata.users[userid] =
                        {
                            "credits": 200
                            , "bot": msg.author.bot
                            , "whenclaimed": (Date.now() - 86400000)
                        };
                    usrobj = usrdata.users[msg.author.id]
                };
                if (args[1]) {
                    var subsyntax;
                    switch (args[1]) {
                        case 'saldo':
                            subsyntax = getCommandSyntax("saldo");
                            msg.reply(usrobj.credits)
                                .then(msg => {
                                    /*msg.delete(15000)*/
                                })
                                .catch(error => console.log(error));
                            break;
                        case 'uhkapeli':
                            subsyntax = getCommandSyntax("uhkapeli");
                            if (!isNaN(parseInt(args[2])) && parseInt(args[2]) > 0) {
                                if (parseInt(args[2]) <= parseInt(usrobj.credits)) {
                                    msg.channel.send('Käyttäjä ' + msg.author.username + ' uhkapelaa ' + args[2] + ' kolikolla. Lets mennään.')
                                        .then(msg => {
                                            /*msg.delete(15000)*/
                                            ;
                                        })
                                        .catch(error => console.log(error));

                                    function winorlose() {
                                        var result = Math.round(Math.random());
                                        if (result === 1) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    }
                                    if (winorlose()) {
                                        msg.channel.send('Voitto!')
                                            .then(msg => {
                                                /*msg.delete(15000)*/
                                                ;
                                            })
                                            .catch(error => console.log(error));
                                        usrobj.credits = parseInt(usrobj.credits) + parseInt(args[2]);
                                    } else {
                                        msg.channel.send('Häviö!')
                                            .then(msg => {
                                                /*msg.delete(15000)*/
                                                ;
                                            })
                                            .catch(error => console.log(error));
                                        usrobj.credits = parseInt(usrobj.credits) - parseInt(args[2]);
                                    }
                                } else {
                                    msg.channel.send(msg.author.username + ', ei tarpeeks koleja!')
                                        .then(msg => {
                                            /*msg.delete(15000)*/
                                            ;
                                        })
                                        .catch(error => console.log(error));
                                }
                            } else {
                                msg.reply(subsyntax)
                                    .then(msg => {
                                        /*msg.delete(15000)*/
                                        ;
                                    })
                                    .catch(error => console.log(error));
                            }
                            break;
                        case 'lahjoita':
                            subsyntax = getCommandSyntax("lahjoita");
                            if (!isNaN(parseInt(args[2])) && parseInt(args[2]) > 0 && args[3]) {
                                if (parseInt(args[2]) <= parseInt(usrobj.credits)) {
                                    var giftTo = '';

                                    function gambleCheck(userid) {
                                        for (var i = 0; i < usrdata.users.length; i++) {
                                            if (usrdata.users[i].id == userid) {
                                                giftTo = usrdata.users[i];
                                                return true;
                                            }
                                        }
                                    }
                                    if (gambleCheck(args[3].replace(/\D/g, ''))) {
                                        usrobj.credits = usrobj.credits - parseInt(args[2]);
                                        giftTo.credits = giftTo.credits + parseInt(args[2]);
                                        msg.reply('`Lahjoitit ' + parseInt(args[2]) + ' kolikkoa onnistuneesti!`')
                                            .then(msg => {
                                                /*msg.delete(15000)*/
                                                ;
                                            })
                                            .catch(error => console.log(error));
                                    } else {
                                        msg.reply('Valitsemasi pelaaja ei ole vielä koskaan käyttänyt komentoa: `' + prefix + 'money`, et voi lahjoittaa hänelle.`')
                                            .then(msg => {
                                                /*msg.delete(15000)*/
                                                ;
                                            })
                                            .catch(error => console.log(error));
                                    }
                                } else {
                                    msg.channel.send(msg.author.username + ', ei tarpeeks koleja!')
                                        .then(msg => {
                                            /*msg.delete(15000)*/
                                            ;
                                        })
                                        .catch(error => console.log(error));
                                }
                            } else {
                                msg.reply(subsyntax)
                                    .then(msg => {
                                        /*msg.delete(15000)*/
                                        ;
                                    })
                                    .catch(error => console.log(error));
                            }
                            break;
                        case 'kauppa':
                            subsyntax = getCommandSyntax("kauppa");
                            msg.channel.send(' <:thonk4:414484594381946910> `**' + (msg.author.username)
                                .toUpperCase() + ', KAUPPA ON SULJETTU**` <:thonk4:414484594381946910>  ')
                                .then(msg => {
                                    /*msg.delete(15000)*/
                                    ;
                                })
                                .catch(error => console.log(error));
                            break;
                        case 'palkka':
                            var subsyntax = getCommandSyntax("palkka");
                            if (Date.now() - usrobj.whenclaimed > 86400000) {
                                msg.reply(`Sait päivän palkan, eli ${daily} kolikkelia.`)
                                    .then(msg => {
                                        /*msg.delete(15000)*/
                                        ;
                                    })
                                    .catch(error => console.log(error));
                                usrobj.whenclaimed = Date.now();
                                usrobj.credits = usrobj.credits + daily;
                            } else {
                                var timeremaining = Math.round(((((((usrobj.whenclaimed + 86400000) - Date.now()) / 1000) / 60) / 60) * 100) / 100);
                                msg.reply('Vielä ' + timeremaining + ' tuntia et saat kolikkeleit.')
                                    .then(msg => {
                                        /*msg.delete(15000)*/
                                        ;
                                    })
                                    .catch(error => console.log(error));
                            }
                            break;
                        default:
                            msg.reply(syntax)
                                .then(msg => {
                                    /*msg.delete(15000)*/
                                })
                                .catch(error => console.log(error));
                            break;
                    }
                } else {
                    msg.reply(syntax)
                        .then(msg => {
                            /*msg.delete(15000)*/
                            ;
                        })
                        .catch(error => console.log(error));
                }
                /*msg.delete(15000)*/
                ;
                fs.writeFile("./data/user-data.json", JSON.stringify(usrdata), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        }

        function commandAnimation(msg, args) {
            var syntax = getCommandSyntax();
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
                    }).catch(error => console.log(error));
                } else {
                    var str = Object.keys(animation);
                    msg.channel.send("Lista saatavailla olevista animaatioista:```" + str + "```");
                }
            } else {
                msg.channel.send(syntax);
            }
        }

        function commandPing(msg, args) {
            var syntax = getCommandSyntax();
            var now = Date.now();
            msg.reply("Pong: " + (now - msg.createdTimestamp) + "ms")
                .then(msg => {
                    /*msg.delete(15000)*/
                    ;
                })
                .catch(error => console.log(error));
            /*msg.delete(15000)*/
            ;
        }

        function commandDankmeme(msg, args) {
            var syntax = getCommandSyntax();
            var memeSound = ['./sound/meme.mp3', './sound/meme2.mp3', './sound/meme3.mp3']
            if (msg.member.voiceChannel) {
                IsBusy = true;
                msg.member.voiceChannel.join()
                    .then(connection => {
                        var randomSound = memeSound[Math.floor(Math.random() * memeSound.length)];
                        playSound(randomSound, msg, connection);
                    });
            } else {
                msg.reply('mene eka jollekki voicechannelille kid.')
                    .then(msg => {
                        /*msg.delete(15000)*/
                        ;
                    })
                    .catch(error => console.log(error));
            }
            /*msg.delete(15000)*/
            ;
        }

        function commandThonk(msg, args) {
            var syntax = getCommandSyntax();
            /*msg.delete(15000)*/
            ;
            msg.channel.send('<a:thonk:443343009229045760>');
        }

        function commandPussukat(msg, args) {
            var syntax = getCommandSyntax();
            if (msg.member.voiceChannel) {
                IsBusy = true;
                var dir = './sound/sp/sp' + (Math.floor(Math.random() * (42 - 1 + 1)) + 1) + '.mp3';
                msg.member.voiceChannel.join()
                    .then(connection => {
                        playSound(dir, msg, connection);
                    });
            } else {
                msg.reply('mene eka jollekki voicechannelille kid.')
                    .then(msg => {
                        /*msg.delete(15000)*/
                    })
                    .catch(error => console.log(error));
            }
            /*msg.delete(15000)*/
            ;
        }

        function commandOof(msg, args) {
            var syntax = getCommandSyntax();
            if (msg.member.voiceChannel) {
                IsBusy = true;
                msg.member.voiceChannel.join()
                    .then(connection => {
                        playSound('./sound/oof.mp3', msg, connection);
                    });
            } else {
                msg.reply('mene eka jollekki voicechannelille kid.')
                    .then(msg => {
                        /*msg.delete(15000)*/
                        ;
                    })
                    .catch(error => console.log(error));
            }
            /*msg.delete(15000)*/
            ;
        }

        function commandTomb(msg, args) {
            var syntax = getCommandSyntax();
            msg.channel.send('NYT RIITTAEAE VANDALISOINTI')
                .then(msg => {
                    /*msg.delete(15000)*/
                    ;
                })
                .catch(error => console.log(error));
            setTimeout(function () {
                msg.channel.send('TAEAE ON NYT TEIKAEN HAUTA')
                    .then(msg => {
                        /*msg.delete(15000)*/
                        ;
                    })
                    .catch(error => console.log(error));
                setTimeout(function () {
                    msg.channel.send('OLET HERAETTYNYT MEIDAET')
                        .then(msg => {
                            /*msg.delete(15000)*/
                            ;
                        })
                        .catch(error => console.log(error));
                }, 1500)
            }, 1500);
            /*msg.delete(15000)*/
            ;
        }

        function commandHus(msg, args) {
            var syntax = getCommandSyntax();
            if (msg.member.voiceChannel) {
                msg.member.voiceChannel.leave();
            }
            /*msg.delete(15000)*/
            ;
        }

        function commandSpam(msg, args) {

            var syntax = getCommandSyntax();
            if (args[3]) {
                var userid = args[1].replace(/\D/g, '');
                if (msg.guild.members.get(userid)) {
                    if (typeof (args[2]) !== 'string') {
                        args[2] = args[2].toString();
                    }
                    if (args[4]) {
                        for (var i = 4; i < args.length; i++) {
                            args[3] = args[3] + ' ' + args[i];
                        }
                    }
                    for (var i = 0; i < args[2]; i++) {
                        msg.guild.members.get(userid)
                            .send(args[3]);
                    }
                } else {
                    msg.reply(syntax)
                        .then(msg => {
                            msg.delete(15001)
                        })
                        .catch(err => console.log(error));
                }
            } else {
                msg.reply(syntax)
                    .then(msg => {
                        msg.delete(15001)
                    })
                    .catch(err => console.log(error));
            }
            msg.delete(5000);
        }

        function commandBusy(msg, args) {
            var syntax = getCommandSyntax();
            msg.channel.send('IsBusy: ' + IsBusy)
                .then(msg => {
                    msg.delete(10000)
                })
                .catch(error => console.log(error));
            msg.delete(10000);
        }

        function commandRestart(msg, args) {
            client.destroy()
                .then(() => client.login(token));
            msg.delete(10000);
        }

        function commandSudo(msg, args) {
            var syntax = getCommandSyntax();
            if (args[2]) {
                var channelid = args[1].replace(/\D/g, '');
                var sudochannel = client.channels.get(channelid);
                if (sudochannel) {
                    if (args[3]) {
                        for (var i = 3; i < args.length; i++) {
                            args[2] = args[2] + ' ' + args[i];
                        }
                    }
                    if (typeof (args[2]) !== 'string') {
                        args[2] = args[2].toString();
                    }
                    sudochannel.send(args[2])
                        .catch(err => console.log(error));
                } else {
                    msg.reply(syntax)
                        .then(msg => {
                            msg.delete(15001)
                        })
                        .catch(err => console.log(error));
                }
            } else {
                msg.reply(syntax)
                    .then(msg => {
                        msg.delete(15001)
                    })
                    .catch(err => console.log(error));
            }
            msg.delete(10000);
        }

        function commandSudopm(msg, args) {
            var syntax = getCommandSyntax();
            if (args[2]) {
                var userid = args[1].replace(/\D/g, '');
                var sudouser = msg.guild.members.get(userid);
                if (sudouser) {
                    if (args[3]) {
                        for (var i = 3; i < args.length; i++) {
                            args[2] = args[2] + ' ' + args[i];
                        }
                    }
                    if (typeof (args[2]) !== 'string') {
                        args[2] = args[2].toString();
                    }
                    sudouser.send(args[2]);
                } else {
                    msg.reply(syntax)
                        .then(msg => {
                            msg.delete(15001)
                        })
                        .catch(err => console.log(error));
                }
            } else {
                msg.reply(syntax)
                    .then(msg => {
                        msg.delete(15001)
                    })
                    .catch(err => console.log(error));
            }
            msg.delete(1200);
        }

        function commandSammuta(msg, args) {
            var syntax = getCommandSyntax();
            msg.delete(1000);
            setTimeout(function () {
                client.destroy()
            }, 2500);
        }

        function commandPuhista(msg, args) {
            var syntax = getCommandSyntax();
            if (args[1] >= 2 && args[1] <= 99) {
                var todel = parseInt(args[1]) + 1;
                msg.channel.bulkDelete(todel)
                    .then(() => {
                        msg.channel.send(`Poistin ${args[1]} viestiä.`)
                            .then(msg => msg.delete(3000));
                    });
            } else {
                msg.channel.send(syntax);
            }

        }

        function commandUptime(msg, args) {
            var syntax = getCommandSyntax();
            var uptime = {};
            uptime.ms = (client.uptime);
            uptime.ts = (client.uptime / 1000);
            uptime.h = Math.trunc(uptime.ts / 3600);
            uptime.tsr = uptime.ts % 3600;
            uptime.m = Math.trunc(uptime.tsr / 60);
            uptime.s = Math.trunc(uptime.tsr % 60);
            uptime.msg = {
                "h": "",
                "m": "",
                "s": ""
            };
            if (uptime.h > 1) {
                uptime.msg.h = `**${uptime.h}** tuntia, `;
            } else if (uptime.h === 1) {
                uptime.msg.h = `**${uptime.h}** tunnin, `;
            }
            else if (uptime.m > 1) {
                uptime.msg.m = `**${uptime.m}** minuuttia, `;
            } else if (uptime.m === 1) {
                uptime.msg.m = `**${uptime.m}** minuutin, `;
            } else if (uptime.s > 1) {
                uptime.msg.s = `**${uptime.s}** sekuntia`;
            } else if (uptime.s <= 1) {
                uptime.msg.s = `**1** sekunnin`;
            }

            uptime.msg.complete = `Tää botti o ollu hereillä jo ${uptime.msg.h}${uptime.msg.m}${uptime.msg.s} :hourglass_flowing_sand:`

            msg.channel.send(uptime.msg.complete);
        }

        function commandEditme(msg, args) {
            var syntax = getCommandSyntax();
            var jimp = client.jimp;
            var avatar = msg.author.avatarURL;
            var avatarfile = `./images/avatar${msg.author.id}.jpg`;
            if (!fs.existsSync(avatarfile)) {
                var file = fs.createWriteStream(avatarfile);
                var request = http.get(avatar, function (response) {
                    response.pipe(file);
                });
            }



            var rand = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
            var imgname = `./images/${rand}.jpg`
            jimp.read(avatarfile)
                .then(image => {
                    return image
                        .resize(256, 256)
                        .quality(60)
                        .pixelate(8)
                        .write(imgname, (err) => {
                            msg.channel.send({
                                file: imgname
                            })
                                .then(msg => {
                                    fs.unlink(imgname, (err) => {
                                        if (err) {
                                            console.log("failed to delete local image:" + err);
                                        }
                                    });
                                })
                                .catch(error => console.log(error))
                        });

                })
                .catch(error => console.log(error))
        }

        resolve({});
    });
}


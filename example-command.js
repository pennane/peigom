
var info = {
    name: "example",
    admin: false,
    syntax: "example <amount> <@who>",
    desc: "description for ,example"
}

var syntax = info.syntax;

module.exports = exports = {};

exports.run = function(msg, client, args) {
    return new Promise((resolve, reject) => {
        /*
        COMMAND LOGIC HERE
        MOVE COMPLETED FILE TO ./modules/commands/
        */
       resolve();
    })
   
}

exports.info = info;
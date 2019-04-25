# Peigom Bot

Peigom Bot is a bot for discord with features for managing servers and emitting entartainment.

Types of commands Peigom has as of now:
* Image manipulation
* Voiceclip playback
* Chat management
* Other fun shenanigans


### Installation

Peigom Bot requires [Node.js](https://nodejs.org/) and a [Discord bot account](https://discordapp.com/developers/applications/) to run.

Install the dependencies and start rolling

```sh
$ git clone https://github.com/Pennane/peigom-bot/
$ cd peigom-bot
$ npm install
$ npm start
```
If `sharp` throws error download its old version: 
```sh
$ npm install sharp@0.20.7
```

If audio commands don't work try installing `ffmpeg-binaries` globally and reinstalling `node-opus`

For Peigom bot to work you need to setup config at `bot/config`

### Development

There is a template command in the root called `example-command.js`.
You can edit it and then move it to `bot/modules/commands/` for it to work.



### Other
An outdated Finnish guide on how to use the bot [here](https://arttu.pennanen.org/sub/peigom-bot_opas/)

License
----

GPL-3.0


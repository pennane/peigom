# Peigom Bot

Peigom Bot is a bot for discord with various features including but not limited to:
* Image manipulation
* Voiceclip playback
* Music bot functionalities
* Chat management


## Installation

Peigom Bot requires [Node.js](https://nodejs.org/) (version 12.x.x+) and a [Discord bot account](https://discordapp.com/developers/applications/) to be run.

Music bot functionalities require an [YouTube Data API v3](https://developers.google.com/youtube/v3/) key.

You need to setup a config file and an authorization file.
`bot/config/` has example files in it.
Duplicate the `default_example.json` and `default_authorization.json` and remove the `default_` prefix from the new files.
Then configure the files with necessary information.

### Install the dependencies and start rolling.

```sh
$ git clone https://github.com/Pennane/peigom-bot/
$ cd peigom-bot
$ npm install
$ npm run start
=> epic
```


### Development

There is a template command in the root called `example-command.js`.
You can edit it and then move it to `bot/modules/commands/` to add new commands.


### Other
An outdated Finnish guide on how to use the bot can be found [here](https://arttu.pennanen.org/sub/peigom-bot_opas/)

License
----

GPL-3.0


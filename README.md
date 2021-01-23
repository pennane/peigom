# Peigom Bot

Peigom Bot is a bot for discord with various features including but not limited to:

- Image manipulation
- Voiceclip playback
- Music bot functionalities
- Chat management

## Installation

### Required keys/tokens

Peigom Bot requires [Node.js](https://nodejs.org/) (version 12.x.x+) and a [Discord bot account](https://discordapp.com/developers/applications/) to run.
Music bot functionalities require an [YouTube Data API v3](https://developers.google.com/youtube/v3/) key.

### Files & dependencies installation

```sh
$ git clone https://github.com/Pennane/peigom-bot/
$ cd peigom-bot
$ npm install
```

You need to setup a config file and an secret `.env` file.

Create a file named `.env` in the root of `/src` with following data:

```
TOKEN=your discord token
YOUTUBE_API_KEY=your youtube api key
GENIUS_ACCESS_TOKEN=your genius api key
```

Edit the config file found in `src/utilities/` to suit your needs.

### Start rolling.

```sh
$ cd peigom-bot
$ npm run start
=> epic
```

### Development

Enter development

```sh
$ npm run dev
=> epic
```

There is a template command in the root called `example-command.js`.
You can edit it and then move it to `src/commands/` to add new commands.

### Other

If you want to add a pre-hosted version of peigom, visit [here](https://peigom.pennanen.dev)

## License

GPL-3.0

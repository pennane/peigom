Discord bot with features for managing your server and creating all kinds of shenanigans.

Requires node.js and npm and a discord bot account.

install [node js](https://nodejs.org/en/download/)

create a discord application [here](https://discordapp.com/developers/applications/me)

Create the bot account to the application and gather your bot token. `KEEP IN MIND THAT YOU SHOULD NEVER SHARE YOUR TOKEN WITH ANYONE!`
![Bot token creation](https://i.imgur.com/bMciwCc.png)


To install dependencies run these in the wanted directory:
```
npm --install
npm install ffmpeg-binaries
npm install node-opus
```

In 'bot/config/' edit the `default.json` file:
````javascript
"discord": {
        "token": "YOUR TOKEN HERE", //Your bot applications token here
        "prefix": ",", //Desired prefix for all the commands
        "authorized": [
            "AUTHORIZED USER ID HERE", // Insert your admin's id
            "ANOTHER AUTHORIZED IF NEEDED" // You can put multiple account ids
        ],
        "authorizedRoles": [
            "AUTHORIZED ROLE-NAMES HERE" // Insert role's name that you want to have admin commands
        ],
        "activity": ",auta" // Insert what activity bot shows in discord
    },
````

To run the bot use `node bot/bot.js` in your bot directory.

Discord bot with features for managing your server and creating all kinds of shenanigans.

Requires node.js, npm and a discord bot account.

install [node js](https://nodejs.org/en/download/)

create a discord application [here](https://discordapp.com/developers/applications/me)

Create the bot account to the application and gather your bot token. `KEEP IN MIND THAT YOU SHOULD NEVER SHARE YOUR TOKEN WITH ANYONE!`
![Bot token creation](https://i.imgur.com/bMciwCc.png)


To install dependencies run this in the wanted directory:
```
npm --install

```

In 'bot/config/' edit the `default.json` file:
````javascript
"discord": {
        "token": "YOUR TOKEN HERE", // Your bot app token here
        "prefix": ",", // Prefix for commands here
        "authorized": [
            "AUTHORIZED USER ID" // Authorized user id's here
        ],
        "authorizedRoles": [
            "AUTHORIZED ROLE" // Authorized role names here
        ],
        "presence": { // For presence configuration
            "activities": [
                ",auta",
                "my name be jeff",
                "yo big man bom",
                "sugondese is a funny meme"
            ],
            "type" : "LISTENING",
            "refreshrate" : 20
        }
````

To run the bot use `node bot/bot.js` in your bot directory.

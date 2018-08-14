Discord bot with features for managing your server and creating all kinds of shenanigans.

Requires node.js and npm.
install [node js](https://nodejs.org/en/download/)

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

To run the bot use 'node bot/bot.js' in installed directory to run.

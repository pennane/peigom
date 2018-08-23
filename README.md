Discord bot with features for managing your server and creating all kinds of shenanigans.

Requires node.js, npm and a discord bot account.

To install dependencies:
```
npm --install

```

In 'bot/config/' edit `default_example.json` and `authorize_example.json` files and remove the `_example`s:
````javascript
{
        "token": "YOUR TOKEN HERE" //Your bot applications token here
}
````

````javascript
"discord": {
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

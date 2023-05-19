# orator
A Text to Speech discord bot.

Orator is a Text to Speech Discord bot having powerfull systems.

## For Developers:

- Make sure to rename `config.js.example` to `config.js` and fill the data.
- To run the bot use `npm install` and then use `node shard.js`.
- The clustering system will then automatically do its job.
- In `/Structures/Command.js` there is the command template, make sure to use that.
- Event template should be like this:

```js
module.exports = {
  name: "eventName", // Event Name according to Discord.
  async execute(...properties, client) {
    // code goes here
  }
}
```

## Libraries used

- `discord.js` for coding the bot.
- `better-sqlite3` for database.
- `discord-player` for playing audio.
- `gtts` and `google-translate-api` for tts generation.
- `fakeyou.js` for custom voice generation.

## Resources used

- `Hetzner` for hosting the bot.
- `Fake You` for custom voices.

## Team

- RK: Owner
- Arijit: Lead Developer
- Frezz1ck: Web Developer.
const express = require("express");
const Database = require("better-sqlite3");
const { EmbedBuilder, WebhookClient } = require("discord.js");
const ms = require("ms");
const config = require("#root/config.js");
const app = express.Router();
app.use(express.json());
const db = new Database("./Database/premium.db");
db.prepare(
  "CREATE TABLE IF NOT EXISTS subscriptions (guild_id TEXT PRIMARY KEY, user_id TEXT, expires INTEGER)"
).run();

const authenticate = (req, res, next) => {
  const { username, password } = req.headers;
  if (username !== config.ApiUsername || password !== config.ApiPassword) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
app.post("/purchase", authenticate, (req, res) => {
  let { userId, userTag, guildName, guildIcon, guildId, time } = req.body;
  if (!userId || !guildId || !time || !userTag || !guildName || !guildIcon) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (guildIcon === null) {
    guildIcon = "";
  }
  const expireTime = Date.now() + ms(time);
  const subscription = db
    .prepare("SELECT * FROM subscriptions WHERE guild_id = ?")
    .get(guildId);
  if (subscription) {
    return res.status(200).json({ message: "Subscription already available" });
  }
  db.prepare(
    "INSERT INTO subscriptions(guild_id, user_id, expires) VALUES(?,?,?)"
  ).run(guildId, userId, expireTime);

  const PremiumClaimedEmbed = new EmbedBuilder()
    .setTitle(`Premium Activated in: ${guildName}`)
    .setThumbnail(guildIcon)
    .setDescription(`Premium Bot: Orator`)
    .addFields(
      {
        name: "__Guild ID__",
        value: `${guildId}`,
      },
      {
        name: "__Booster__",
        value: `${userTag}`,
      },
      {
        name: "__Expiry Time__",
        value: `${time}`,
      }
    )
    .setFooter({
      text: `Used Purchase API`,
    })
    .setColor("#486FFA");

  const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1087969080872546414/qLE6wMRVKvPN6aMFc34fshAUslo3qEaJJ4ILACI68_k1oyN7GkOjFlX-hyEjZ-DW72Aa",
  });

  webhook.send({
    embeds: [PremiumClaimedEmbed],
  });

  res.status(200).json({ message: "Purchase data saved successfully" });
});

module.exports = app;

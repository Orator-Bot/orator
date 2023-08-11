const { EmbedBuilder, WebhookClient } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.customId !== "claim-premium-btn") return;
    const webhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1138905059292356719/X7TnXZY4129yNo9NCfRhxzlV6NY7eF8Kp8NjmgZVE2Te3gAF3zUvMLpVISgF8T4W3t3s",
    });
    const user = interaction.user.id;
    const data = client.giftDB
      .prepare("SELECT * FROM giftDB WHERE user = ?")
      .get(user);

    if (!data) {
      return interaction.reply({
        content: "Sorry, maybe the gift has expired invalid.",
        ephemeral: true,
      });
    }
    const subscription = client.premiumdb
      .prepare("SELECT * FROM subscriptions WHERE guild_id = ?")
      .get(data.giftGuild);

    if (subscription) {
      const endTime = ms(subscription.expires - Date.now(), { long: true });
      return interaction.reply({
        content: `The server (**${await client.guilds
          .fetch(data.giftGuild)
          .then(async (g) => await g.name)} - ${
          data.giftGuild
        }**) already has a premium which will be expired after **${endTime}**. Claim it after that`,
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("You have claimed the gift!")
      .setDescription(
        `The gift was claimed in **${await client.guilds
          .fetch(data.giftGuild)
          .then(async (g) => await g.name)}** for **${ms(
          data.time - Date.now(),
          {
            long: true,
          }
        )}!!!**`
      )
      .setFooter({
        text: "Gift claimed",
      })
      .setTimestamp()
      .setColor(client.color)
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1105371556076605490.webp?&quality=lossless"
      );
    client.giftDB.prepare("DELETE FROM giftDB WHERE user = ?").run(user);
    client.premiumdb
      .prepare(
        "INSERT OR REPLACE INTO subscriptions(guild_id, user_id, expires) VALUES(?,?,?)"
      )
      .run(data.giftGuild, user, parseInt(data.time));
    await webhook.send(
      `<:Tick:1035765324693385226> **${
        interaction.user.username
      }** has claimed a gift for **${await client.guilds
        .fetch(data.giftGuild)
        .then(async (g) => await g.name)} (${data.giftGuild})** - **${ms(
        data.time - Date.now(),
        {
          long: true,
        }
      )}!!!**`
    );
    await interaction.update({
      content: "",
      embeds: [embed],
      components: [],
    });
  },
};

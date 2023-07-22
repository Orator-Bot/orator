const {
  WebhookClient,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
module.exports = {
  name: "ready",
  async execute(client) {
    const webhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1087969080872546414/qLE6wMRVKvPN6aMFc34fshAUslo3qEaJJ4ILACI68_k1oyN7GkOjFlX-hyEjZ-DW72Aa",
    });
    const getPremiumBtn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Renew Premium")
        .setEmoji("<a:__:1063829203117686895>")
        .setURL("https://oratorbot.xyz/premium")
        .setStyle(ButtonStyle.Link)
    );
    setInterval(checkExpiry, 10000);
    async function checkExpiry() {
      const expiredSubscriptions = client.premiumdb
        .prepare("SELECT * FROM subscriptions WHERE expires < ?")
        .all(Date.now());
      for (const subscription of expiredSubscriptions) {
        await webhook.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("Premium Expired")
              .setDescription("Premium Expired Bot: Orator")
              .setTimestamp()
              .addFields(
                {
                  name: "Guild Name",
                  value: `${await client.guilds
                    .fetch(subscription.guild_id)
                    .then(async (g) => await g.name)}`,
                },
                {
                  name: "Guild ID",
                  value: `${subscription.guild_id}`,
                },
                {
                  name: "Booster User",
                  value: `${await client.users
                    .fetch(subscription.user_id)
                    .then(async (u) => await u.username)}`,
                },
                {
                  name: "Booster ID",
                  value: `${subscription.user_id}`,
                }
              ),
          ],
        });
        await client.users
          .send(subscription.user_id, {
            content: `<@${subscription.user_id}> :wave:`,
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `Premium expired in the Guild: ${await client.guilds
                    .fetch(subscription.guild_id)
                    .then(async (g) => await g.name)} (ID: ${
                    subscription.guild_id
                  })`
                ),
            ],
            components: [getPremiumBtn],
          })
          .catch(() => null);
        client.premiumdb
          .prepare("DELETE FROM subscriptions WHERE guild_id = ?")
          .run(subscription.guild_id);
      }
    }
  },
};

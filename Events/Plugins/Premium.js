const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
module.exports = {
  name: "ready",
  async execute(client) {
    const webhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1087969080872546414/qLE6wMRVKvPN6aMFc34fshAUslo3qEaJJ4ILACI68_k1oyN7GkOjFlX-hyEjZ-DW72Aa"
    });
    const getPremiumBtn = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel("Renew Premium")
        .setEmoji("<a:__:1063829203117686895>")
        .setURL("https://oratorbot.xyz/premium")
        .setStyle(ButtonStyle.Link)
      );
    setInterval(checkExpiry, 10000);
    async function checkExpiry() {
      const expiredSubscriptions = client.premiumdb.prepare("SELECT * FROM subscriptions WHERE expires < ?").all(Date.now());
      for (const subscription of expiredSubscriptions) {
        await webhook.send({
          embeds: [new EmbedBuilder()
          .setColor(client.color)
          .setTitle("Premium Expired")
          .setDescription(`__Guild ID:__ ${subscription.guild_id}\n__Booster ID__: [${subscription.user_id}](https://discord.com/users/${subscription.user_id})`)
          .setTimestamp()
          ]
        });
        await client.users.send(subscription.user_id, {
            content: `<@${subscription.user_id}> :wave:`,
            embeds: [new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`Premium expired in a Guild [${subscription.guild_id}] where you boosted earlier.`)
          ],
            components: [getPremiumBtn]
          })
          .catch(() => null);
        client.premiumdb.prepare("DELETE FROM subscriptions WHERE guild_id = ?").run(subscription.guild_id);
      }
    }
  }
};
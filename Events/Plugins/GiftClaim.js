const { EmbedBuilder, WebhookClient } = require("discord.js");
const ms = require("ms");
const fetch = require("node-fetch");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.customId !== "claim-premium-btn") return;
    const webhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1138905059292356719/X7TnXZY4129yNo9NCfRhxzlV6NY7eF8Kp8NjmgZVE2Te3gAF3zUvMLpVISgF8T4W3t3s",
    });
    const preWebhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1087969080872546414/qLE6wMRVKvPN6aMFc34fshAUslo3qEaJJ4ILACI68_k1oyN7GkOjFlX-hyEjZ-DW72Aa",
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

    const endpointURL = `http://46.4.31.110:4008/dbcreate?serverId=${
      data.giftGuild
    }&time=${data.time - Date.now()}`;

    const headers = {
      user: "arijit",
      password: "itsmemario",
    };

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
    try {
      const response = await fetch(endpointURL, {
        method: "POST",
        headers,
      });
    } catch (err) {
      console.log(err);
    }

    const claimEmbed = new EmbedBuilder()
      .setTitle("A gift was claimed")
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1105371556076605490.webp?&quality=lossless"
      )
      .addFields(
        {
          name: "User",
          value: `${await client.users
            .fetch(user)
            .then(async (u) => await u.username)} (${user})`,
        },
        {
          name: "Guild",
          value: `${await client.guilds
            .fetch(data.giftGuild)
            .then(async (g) => await g.name)} (${data.giftGuild})`,
        },
        {
          name: "Time",
          value: `${ms(data.time - Date.now(), {
            long: true,
          })}`,
        }
      )
      .setColor(client.color)
      .setTimestamp();

    await webhook.send({
      embeds: [claimEmbed],
    });

    const PremiumClaimedEmbed = new EmbedBuilder()
      .setTitle(`Premium Activated`)
      .setThumbnail(
        `${await client.guilds
          .fetch(data.giftGuild)
          .then(async (g) => await g.iconURL())}`
      )
      .setDescription("Premium Bot: " + client.user.username)
      .addFields(
        {
          name: "__Guild__",
          value: `${await client.guilds
            .fetch(data.giftGuild)
            .then(async (g) => await g.name)} (${data.giftGuild})`,
        },
        {
          name: "__Booster__",
          value: `${await client.users
            .fetch(user)
            .then(async (u) => await u.username)} (${user})`,
        },
        {
          name: "__Expiry Time__",
          value: `${ms(data.time - Date.now(), {
            long: true,
          })}`,
        }
      )
      .setFooter({
        text: `Redeemed through gift`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor(client.color);

    await preWebhook.send({
      embeds: [PremiumClaimedEmbed],
    });

    await interaction.update({
      content: "The gift was opened and claimed successfully",
      embeds: [embed],
      components: [],
    });
  },
};

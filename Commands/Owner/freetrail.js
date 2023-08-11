const { EmbedBuilder, WebhookClient } = require("discord.js");
const { stripIndent } = require("common-tags");
const fetch = require("node-fetch");
const ms = require("ms");
module.exports = {
  name: "freetrial",
  description: "Give Fres Trial to a Server",
  aliases: [],
  args: true,
  usage: "<guildid>",
  permissions: "",
  botPerms: "",
  ownerOnly: true,
  cooldown: 0,
  category: "dev",
  async execute(message, args, client) {
    const webhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1121316811896537088/Kr4w0On6y2OWg_U2bvBq5zq9sD-7AI_hXpsr3UjmpI8hioHAj94DTpA1GMjJV77u-RDL",
    });

    let guildId = args[0];
    if (!guildId) {
      return message.reply("You need to specify a guild id too.");
    }
    if (guildId.toLowerCase() === "this") {
      guildId = message.guild.id;
    }
    const time = "6h";
    if (!ms(time)) {
      return message.reply("Please specify a valid time.");
    }

    const endpointURL = `http://46.4.31.110:4008/dbcreate?serverId=${guildId}&time=${ms(
      time
    )}`;

    const headers = {
      user: "arijit",
      password: "itsmemario",
    };

    const expireTime = Date.now() + ms(time);

    const userId = "948637316145102868";
    const subscription = client.premiumdb
      .prepare("SELECT * FROM subscriptions WHERE guild_id = ?")
      .get(guildId);

    if (subscription) {
      const endTime = ms(subscription.expires - Date.now(), { long: true });
      return message.reply(
        `That guild (\`${guildId}\`) already has subscription which has ${endTime} remaining.`
      );
    } else {
      client.premiumdb
        .prepare(
          "INSERT OR REPLACE INTO subscriptions(guild_id, user_id, expires) VALUES(?,?,?)"
        )
        .run(guildId, userId, expireTime);
      let description = `:white_check_mark: Added Free Trial to Guild ID: \`${guildId}\` for ${ms(
        ms(time),
        { long: true }
      )}\n`;
      try {
        const response = await fetch(endpointURL, {
          method: "POST",
          headers,
        });
        const data = await response.json();
        if (response.ok) {
          description += ":white_check_mark: Payment API: Done.\n";
        } else {
          description += `❌ Payment API: Error- ${data}`;
        }
      } catch (err) {
        console.log(err);
      }
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(description)
            .setThumbnail(
              await client.guilds
                .fetch(guildId)
                .then(async (g) => await g.iconURL())
            ),
        ],
      });

      const guildName = await client.guilds
        .fetch(guildId)
        .then(async (g) => await g.name);
      const guildIcon = await client.guilds
        .fetch(guildId)
        .then(async (g) => await g.iconURL());
      const boosterTag = await client.users
        .fetch(userId)
        .then(async (u) => await u.tag);
      const PremiumClaimedEmbed = new EmbedBuilder()
        .setTitle(`Free Trial Activated in: ${guildName}`)
        .setThumbnail(guildIcon)
        .setDescription("Premium Bot: " + client.user.username)
        .addFields(
          {
            name: "__Guild ID__",
            value: `${guildId}`,
          },
          {
            name: "__Booster__",
            value: `${boosterTag}`,
          },
          {
            name: "__Expiry Time__",
            value: `${time}`,
          }
        )
        .setFooter({
          text: `Trial added by: ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setColor(client.color);

      await webhook.send({
        embeds: [PremiumClaimedEmbed],
      });
    }
  },
};

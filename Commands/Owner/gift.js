const {
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  WebhookClient,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "gift",
  description: "Gift a premium to a user.",
  ownerOnly: true,
  category: "dev",
  args: true,
  usage: "<@user | userId> <this | guildID> [1d | time>",
  async execute(message, args, client) {
    const user = message.mentions.members.first()?.id || args[0];
    let guildId = args[1];
    if (guildId === "this") guildId = message.guild.id;
    if (!guildId) return message.reply("Please enter a guild Id.");
    if (guildId.toLowerCase() === "this") guildId = message.guild.id;
    const time = args[2];
    if (!ms(time)) {
      return message.reply("Please specify a valid time.");
    }
    const expireTime = Date.now() + ms(time);

    const claimBtn = new ButtonBuilder()
      .setCustomId("claim-premium-btn")
      .setLabel("Claim Now")
      .setStyle(ButtonStyle.Success);

    const embed = new EmbedBuilder()
      .setTitle("You have been gifted a Premium Subscription!")
      .setDescription(
        `You have been gifted a premium subscription by **${message.author.username}**\nClick on the *\`Claim Now\`* button to claim it.`
      )
      .setFooter({
        text: "Gift recieved",
      })
      .setTimestamp()
      .setColor(client.color)
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1105371556076605490.webp?&quality=lossless"
      );

    const buttons = new ActionRowBuilder().addComponents(claimBtn);
    const webhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1138905059292356719/X7TnXZY4129yNo9NCfRhxzlV6NY7eF8Kp8NjmgZVE2Te3gAF3zUvMLpVISgF8T4W3t3s",
    });

    await webhook.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `${
              message.author.username
            } has gifted a premium to **${user} - ${await client.users
              .fetch(user)
              .then(
                async (usr) => await usr.username
              )}**, Guild: ${await client.guilds
              .fetch(guildId)
              .then(async (g) => await g.name)} (${guildId}) for ${time}`
          ),
      ],
    });

    try {
      await client.users
        .send(user, {
          content: `<:roti_giveaway:1105371556076605490> <@${user}>,`,
          embeds: [embed],
          components: [buttons],
        })
        .then(async () => {
          client.giftDB
            .prepare(
              "INSERT OR REPLACE INTO giftDB(user, giftGuild, time) VALUES(?, ?, ?)"
            )
            .run(user, guildId, expireTime);
          await message.channel.send(
            "<:roti_giveaway:1105371556076605490> You have gifted a Premium Subscription."
          );
        })
        .catch((err) => message.reply("Gift not sent."));
    } catch (error) {
      console.error(error);
      return message.reply("User not found.");
    }
  },
};

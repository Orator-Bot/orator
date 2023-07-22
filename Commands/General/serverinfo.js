const { stripIndent } = require("common-tags");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");
module.exports = {
  name: "serverinfo",
  description: "Get the premium information of the server.",
  aliases: ["si"],
  category: "general",
  async execute(message, args, client) {
    const getPremiumBtn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Upgrade to Premium")
        .setEmoji("<a:__:1063829203117686895>")
        .setURL("https://discord.gg/TeS3haQ4tT")
        .setStyle(ButtonStyle.Link)
    );

    const data = client.premiumdb
      .prepare("SELECT * FROM subscriptions WHERE guild_id = ?")
      .get(message.guild.id);

    if (!data) {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${message.guild.name} - Info`)
            .setDescription(
              stripIndent`
        ${message.guild.name} don't have any active premium plans.
      `
            )
            .setThumbnail(message.guild.iconURL())
            .setColor(client.color)
            .setFooter({
              text: `Requested by ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
        components: [getPremiumBtn],
      });
    } else {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${message.guild.name} - Info`)
            .setDescription(
              stripIndent`
        <a:__:1063829203117686895> Premium is active in ${message.guild.name}.
      `
            )
            .addFields(
              {
                name: "Expires In:",
                value: ms(data.expires - Date.now(), { long: true }),
              },
              {
                name: "Boosted By:",
                value: `<@${data.user_id}>`,
              }
            )
            .setColor(client.color)
            .setThumbnail(message.guild.iconURL())
            .setFooter({
              text: `Requested by ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    }
  },
};

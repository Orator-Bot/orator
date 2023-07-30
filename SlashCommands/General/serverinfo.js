const { stripIndent } = require("common-tags");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");
const ms = require("ms");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Get the information about your server.")
    .setDMPermission(false),
  async execute(interaction, client) {
    const getPremiumBtn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Upgrade to Premium")
        .setEmoji("<a:__:1063829203117686895>")
        .setURL("https://discord.gg/TeS3haQ4tT")
        .setStyle(ButtonStyle.Link)
    );

    const data = client.premiumdb
      .prepare("SELECT * FROM subscriptions WHERE guild_id = ?")
      .get(interaction.guild.id);

    if (!data) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${interaction.guild.name} - Info`)
            .setDescription(
              stripIndent`
        ${interaction.guild.name} don't have any active premium plans.
      `
            )
            .setThumbnail(interaction.guild.iconURL())
            .setColor(client.color)
            .setFooter({
              text: `Requested by ${interaction.author.tag}`,
              iconURL: interaction.author.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
        components: [getPremiumBtn],
      });
    } else {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${interaction.guild.name} - Info`)
            .setDescription(
              stripIndent`
        <a:__:1063829203117686895> Premium is active in ${interaction.guild.name}.
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
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({
              text: `Requested by ${interaction.user.username}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    }
  },
};

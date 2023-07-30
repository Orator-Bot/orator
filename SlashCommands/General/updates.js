const { Pagination } = require("pagination.djs");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const { stripIndent } = require("common-tags");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("updates")
    .setDescription("Check the recent updates."),
  async execute(interaction, client) {
    const updates = client.updatesdb
      .prepare("SELECT * FROM updates ORDER BY date DESC")
      .all();
    if (!updates) {
      return interaction.reply("No changelogs were found!");
    }
    const fields = updates.map((update) => ({
      name: `Update Date: ${update.date}`,
      value: `**Update ID:** ${update.id}\n\n> ${update.messsage}`,
    }));
    const pagination = new Pagination(interaction, { limit: 1, idle: 10000 })
      .setTitle(client.user.username + " Updates")
      .setColor(client.color)
      .setDescription("Recent bot updates:")
      .addFields(fields)
      .paginateFields(true)
      .reply();
  },
};

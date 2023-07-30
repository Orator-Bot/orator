const { SlashCommandBuilder } = require("discord.js");
const { Pagination } = require("pagination.djs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mails")
    .setDescription("Check your mails"),
  async execute(interaction, client) {
    const updates = client.maildb
      .prepare("SELECT * FROM mail WHERE user = ? ORDER BY date DESC")
      .all(interaction.user.id);

    if (!updates) {
      return interaction.reply({
        content: "No mails found in your inbox.",
        ephemeral: true,
      });
    } else if (updates.length < 1) {
      const paginationNull = new Pagination(interaction, {
        limit: 1,
        idle: 60000,
      })
        .setTitle("📩" + interaction.user.username + ": Mails")
        .setColor(client.color)
        .setDescription(
          "**__Recent Mails__**:\n\nNo mails found in your inbox."
        )
        .reply();
      return;
    } else {
      const fields = updates.map((update) => ({
        name: `Mail Date: ${update.date}`,
        value: `**Mail ID:** ${update.id}\n\n${update.message}`,
      }));
      const pagination = new Pagination(interaction, { limit: 1, idle: 60000 })
        .setTitle("📩" + interaction.user.username + ": Mails")
        .setColor(client.color)
        .setDescription("**__Recent Mails__**:")
        .addFields(fields)
        .paginateFields(true)
        .reply();
    }
  },
};

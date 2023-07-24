const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the ping information of the bot.")
    .setDMPermission(false),
  async execute(interaction, client) {
    await interaction.reply({
      content: `Client Ping: ${client.ws.ping}ms`,
      ephemeral: true,
    });
  },
};

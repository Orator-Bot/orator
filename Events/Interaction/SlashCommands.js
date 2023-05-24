const { Client, CommandInteraction, InteractionType, EmbedBuilder } = require("discord.js");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        content: "This Command Has Been Removed!",
        ephemeral: true,
      });
    }
    if (command.developer && !client.config.owners.includes(interaction.user.id)) {
      return interaction.reply({
        content: "This command is only available for the Developers.",
        ephemeral: true,
      });
    }
      await command.execute(interaction, client);
  }
};
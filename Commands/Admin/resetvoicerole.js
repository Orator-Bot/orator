const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "resetvoicerole",
  description: "Reset the voice role",
  aliases: [],
  args: false,
  usage: "",
  permissions: "Administrator",
  botPerms: "ManageRoles",
  ownerOnly: false,
  cooldown: 0,
  category: "admin",
  async execute(message, args, client) {
    const successEmbed = new EmbedBuilder()
      .setDescription("Successfully reset the VC Role.")
      .setColor(client.color);

    client.voicerole
      .prepare("DELETE FROM voicerole WHERE guild = ?")
      .run(message.guild.id);

    message.channel.send({ embeds: [successEmbed] });
  },
};

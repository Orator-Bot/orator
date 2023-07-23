const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "setvoicerole",
  description: "Setup a voice role",
  aliases: [],
  args: true,
  usage: "<@role | role id>",
  permissions: "Administrator",
  botPerms: "ManageRoles",
  ownerOnly: false,
  cooldown: 0,
  category: "admin",
  async execute(message, args, client) {
    const role =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) return message.reply("Please mention a valid role.");

    const successEmbed = new EmbedBuilder()
      .setDescription(`Successfully set ${role} as VC Role.`)
      .setColor(client.color);

    client.voicerole
      .prepare("INSERT OR REPLACE INTO voicerole(guild, role) VALUES(?,?)")
      .run(message.guild.id, role.id);

    message.channel.send({ embeds: [successEmbed] });
  },
};

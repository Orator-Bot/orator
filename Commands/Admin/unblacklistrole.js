const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "unblacklistrole",
  description: "Unblacklist a role from using the Orator TTS commands.",
  aliases: ["ubu"],
  args: true,
  usage: "<roleid | @role>",
  permissions: "Administrator",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  category: "admin",
  async execute(message, args, client) {
    const role =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role)
      return message.reply("Please mention the role or use the valid role id.");

    client.resetblacklistrole.run(message.guild.id, role.id);
    message.channel.send(`Unblacklisted role: \`${role.name}\`.`);
  },
};

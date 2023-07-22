const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "unblacklistuser",
  description: "Unblacklist a user from using the Orator TTS commands.",
  aliases: ["ubu"],
  args: true,
  usage: "<userid | @user>",
  permissions: "Administrator",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  category: "admin",
  async execute(message, args, client) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return message.reply(
        "Please mention the user or use the valid id of the user."
      );
    const data = client.getblacklistuser.get(message.guild.id, member.user.id);
    if (!data) return message.reply("That user isn't blacklisted.");

    client.resetblacklistuser.run(message.guild.id, member.user.id);
    message.channel.send(`Unblacklisted user: \`${member.user.tag}\`.`);
  },
};

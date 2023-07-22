const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "modunban",
  description: "Unbans a user",
  aliases: [],
  args: true,
  usage: "<userId | @user>",
  permissions: "",
  botPerms: "",
  ownerOnly: true,
  cooldown: 0,
  category: "dev",
  async execute(message, args, client) {
    let userId = args[0];
    const mentionedMember = message.mentions.members.first();
    if (mentionedMember) userId = mentionedMember.user.id;

    client.unbanuser.run(userId);
    message.reply("Unbanned user.");
  },
};

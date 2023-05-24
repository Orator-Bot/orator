const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "blacklistuser",
  description: "Blacklist a user from using the Orator TTS commands.",
  aliases: ["bu"],
  args: true,
  category: "admin",
  usage: "<userid | @user>",
  permissions: "Administrator",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  async execute(message, args, client){
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.reply("Please mention the user or use the valid id of the user.");
    client.setblacklistuser.run(message.guild.id, member.user.id);
    message.channel.send(`Blacklisted user: \`${member.user.tag}\` from using the TTS commands in this server.`);
  }
};
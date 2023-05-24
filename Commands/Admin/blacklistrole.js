const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "blacklistrole",
  description: "Blacklist a role from using the Orator TTS commands.",
  aliases: ["br"],
  category: "admin",
  args: true,
  usage: "<roleid | @role>",
  permissions: "Administrator",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  premium: true,
  async execute(message, args, client){
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!role) return message.reply("Please mention the role or use the valid role id.");
    client.setblacklistrole.run(message.guild.id, role.id);
    message.channel.send(`Blacklisted role: \`${role.name}\` from using the TTS commands in this server.`);
  }
};
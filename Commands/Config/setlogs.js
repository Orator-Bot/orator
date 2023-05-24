const {
  ChannelType
} = require("discord.js");

module.exports = {
  name: "setlogs",
  description: "Set the logs channel",
  args: true,
  usage: "<channel>",
  permissions: "Administrator",
  premium: true,
  category: "config",
  async execute(message, args, client) {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) return message.reply("Invalid Channel Provided.");
    if (channel.type !== ChannelType.GuildText) return message.reply("The channel must be a text channel.");

    client.setlogs.run(message.guild.id, channel.id);
    await message.channel.send(`Set the TTS logs channel to ${channel}`);
  }
};
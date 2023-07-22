const { ChannelType } = require("discord.js");
module.exports = {
  name: "setjointocreate",
  aliases: ["setjtc"],
  description: "Setup the Join to Create VC channel.",
  category: "jointocreate",
  async execute(message, args, client) {
    const channel = message.guild.channels.cache.get(args[0]);
    if (!channel)
      return message.reply("You have provided an invalid channel id.");

    const channelType = channel.type;
    if (channelType !== ChannelType.GuildVoice)
      return message.reply("The channel must be a Text Channel.");

    client.setjtc.run(message.guild.id, channel.id);
    message.channel.send(
      `Successfully set ${channel} as Join to Create voice channel.`
    );
  },
};

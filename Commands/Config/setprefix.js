module.exports = {
  name: "setprefix",
  description: "Set the new prefix of the bot.",
  usage: "<prefix>",
  args: true,
  permissions: "Administrator",
  category: "config",
  async execute(message, args, client) {
    const newPrefix = args[0];
    if (newPrefix.length > 5)
      return message.reply("The prefix must not exceed 5 characters.");

    client.setprefix.run(message.guild.id, newPrefix);
    message.channel.send(
      "Changed the prefix of **" + message.guild.name + "** " + newPrefix
    );
  },
};

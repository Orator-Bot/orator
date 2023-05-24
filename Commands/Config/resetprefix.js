module.exports = {
  name: "resetprefix",
  description: "Reset the prefix of the bot.",
  permissions: "Administrator",
  category: "config",
  async execute(message, args, client) {
    client.resetprefix.run(message.guild.id);
    message.channel.send("Successfully reset the prefix of the bot.");
  }
};
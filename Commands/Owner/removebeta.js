module.exports = {
  name: "removebeta",
  description: "Remove beta from a guild",
  ownerOnly: true,
  args: true,
  usage: "<Guild ID>",
  category: "dev",
  async execute(message, args, client) {
    const guildId = args[0];
    client.betadb.prepare("DELETE FROM beta WHERE guild_id = ?").run(guildId);
    message.reply("Removed Beta Access.");
  },
};

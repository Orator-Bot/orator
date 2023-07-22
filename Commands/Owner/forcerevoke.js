const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "forcerevoke",
  description: "Force revoke a guild premium",
  aliases: [],
  args: true,
  usage: "",
  permissions: "",
  botPerms: "",
  ownerOnly: true,
  cooldown: 0,
  category: "dev",
  async execute(message, args, client) {
    client.premiumdb
      .prepare("DELETE FROM subscriptions WHERE guild_id = ?")
      .run(args[0]);
    client.resetpanel.run(args[0]);
    client.resetlogs.run(args[0]);
    client.webhookdb
      .prepare("DELETE FROM webhookchannel WHERE guild_id = ?")
      .run(args[0]);
    client.webhookdb
      .prepare("DELETE FROM webhookvc WHERE guild_id = ?")
      .run(args[0]);
    const blacklistRoleDB = new client.database("./Database/blacklistrole.db");
    blacklistRoleDB
      .prepare("DELETE FROM blacklistrole WHERE guild_id = ?")
      .run(args[0]);
    message.channel.send(`Revoked ${args[0]}`);
  },
};

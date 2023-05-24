const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "addbeta",
  description: "Add Beta to a Guild",
  aliases: [],
  args: true,
  usage: "<Guild ID>",
  permissions: "",
  botPerms: "",
  ownerOnly: true,
  cooldown: 0,
  beta: false,
  category: "dev",
  async execute(message, args, client){
    const guildId = args[0];
    client.betadb.prepare("INSERT OR REPLACE INTO beta(guild_id) VALUES(?)").run(guildId);
    message.reply(`:white_check_mark: Added Beta Access to Server: \`${guildId}\`.`);
  }
};
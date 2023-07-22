const { EmbedBuilder } = require("discord.js");
const { Pagination } = require("pagination.djs");
module.exports = {
  name: "premiumlist",
  description: "List the servers having Premium",
  aliases: [],
  args: false,
  usage: "",
  permissions: "",
  botPerms: "",
  ownerOnly: true,
  cooldown: 0,
  category: "dev",
  async execute(message, args, client) {
    const servers = client.premiumdb
      .prepare("SELECT * FROM subscriptions")
      .all();
    const fields = servers.map((data) => ({
      name: data.guild_id,
      value: `**__Booster:__** <@${data.user_id}>\n**__Booster ID:__** ${
        data.user_id
      }\n**__Time Left__**: <t:${Math.floor(data.expires / 1000)}:R>`,
      inline: true,
    }));
    const pagination = new Pagination(message, { limit: 3, idle: 10000 })
      .setColor(client.color)
      .addFields(fields)
      .paginateFields(true)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: "Premium Servers List",
        iconURL: client.user.displayAvatarURL(),
      })
      .send();
  },
};

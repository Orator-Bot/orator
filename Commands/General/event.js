const { Message, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "event",
  description: "Orator Bot Event Code - 2308v",
  aliases: [],
  args: false,
  usage: "",
  permissions: "",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  category: "general",
  premium: false,
  voteOnly: false,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setDescription("Comming Soon...")
      .setColor(client.color);

    message.channel.send({
      embeds: [embed],
    });
  },
};

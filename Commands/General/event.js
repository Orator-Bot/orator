const { Message, Client } = require("discord.js");

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
    message.channel.send({
      content: "Coming Soon...",
    });
  },
};

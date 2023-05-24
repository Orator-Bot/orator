const { EmbedBuilder, WebhookClient } = require("discord.js");
const ms = require("ms");
module.exports = {
  name: "redeem",
  category: "general",
  description: "Enter the premium code. (One code can be used once.)",
  args: true,
  usage: "<code>",
  stop: true,
  async execute(message, args, client) {
    message.reply("Redeem command is currently under maintenance.");
  }
};
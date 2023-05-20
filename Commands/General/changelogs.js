const { Pagination } = require("pagination.djs")
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder } = require("discord.js")
const { stripIndent } = require("common-tags")
module.exports = {
  name: "changelogs",
  description: "Check the changelogs of the bot.",
  category: "general",
  aliases: ["updates"],
  async execute(message, args, client) {
    const updates = client.updatesdb.prepare("SELECT * FROM updates ORDER BY date DESC").all()
    if (!updates) {
      return message.reply("No changelogs were found!")
    };
    const fields = updates.map((update) => ({
      name: `Update Date: ${update.date}`,
      value: `**Update ID:** ${update.id}\n\n> ${update.message}`
    }));
    const pagination = new Pagination(message, { limit: 1, idle: 10000})
      .setTitle(client.user.username + ' Updates')
      .setColor(client.color)
      .setDescription('Recent bot updates:')
      .addFields(fields)
      .paginateFields(true)
      .send()
  }
}
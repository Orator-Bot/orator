const { Pagination } = require("pagination.djs")
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder } = require("discord.js")
const { stripIndent } = require("common-tags")
module.exports = {
  name: "mail",
  description: "Check the mail of the yours.",
  category: "general",
  aliases: ["mails"],
  async execute(message, args, client) {
    const updates = client.maildb.prepare("SELECT * FROM mail WHERE user = ? ORDER BY date DESC").all(message.author.id)
    if (!updates) {
      return message.reply("No mails were found!")
    };
    if(updates.length < 1){
      const paginationNull = new Pagination(message, { limit: 1, idle: 10000})
      .setTitle("📩" + message.author.tag + ': Mails')
      .setColor(client.color)
      .setDescription('**__Recent Mails__**:\n\nNo Mails were found!')
      .send()
      return
    }
    const fields = updates.map((update) => ({
      name: `Mail Date: ${update.date}`,
      value: `**Mail ID:** ${update.id}\n\n${update.message}`
    }));
    const pagination = new Pagination(message, { limit: 1, idle: 10000})
      .setTitle("📩" + message.author.tag + ': Mails')
      .setColor(client.color)
      .setDescription('**__Recent Mails__**:')
      .addFields(fields)
      .paginateFields(true)
      .send()
  }
}
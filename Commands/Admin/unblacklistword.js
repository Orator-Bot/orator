const { EmbedBuilder } = require("discord.js")
module.exports = {
  name: "unblacklistword",
  description: "Unblacklist a blacklisted word.",
  aliases: ['unw'],
  args: true,
  usage: "<word>",
  permissions: "Administrator",
  botPerms: "",
  ownerOnly: false,
  category: "admin",
  async execute(message, args, client){
    const word = args[0]
    client.resetblacklistword.run(message.guild.id, word)
    message.reply('Unblacklisted the word: \`' + word + '\`.')
  }
}
module.exports = {
  name: 'blacklistword',
  description: 'Blacklist a word from being used in the TTS messages.',
  args: true,
  usage: "<word>",
  category: "admin",
  permissions: "Administrator",
  async execute(message, args, client) {
    const word = args[0]
    client.setblacklistword.run(message.guild.id, word)
    await message.reply(`Marked \`${word}\` as Blacklisted.`)
  }
}
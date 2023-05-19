const { EmbedBuilder } = require('discord.js')
const Dot = '<:dot_red:1097807433910460488>'
module.exports = {
  name: 'ping',
  category: "general",
  description: 'Check the ping of the bot.',
  async execute(message, args, client){
    await message.channel.send('Fetching bot ping...')
    .then(async(m) => {
      const Embed = new EmbedBuilder()
      .setDescription(`${Dot} Pong 🏓\n${Dot} Client Ping: ${Math.floor(m.createdTimestamp - message.createdTimestamp)}ms\n${Dot} API Ping: ${Math.floor(client.ws.ping)}ms`)
      .setColor(client.color)
      await m.edit({
        content: '',
        embeds: [Embed]
      })
    })
  }
}
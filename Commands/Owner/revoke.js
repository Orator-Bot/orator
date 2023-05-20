module.exports = {
  name: "revoke",
  ownerOnly: true,
  description: "Revoke access of a premium guild",
  args: true,
  category: "dev",
  usage: "<guild id>",
  async execute(message, args, client) {
    let guildID = args[0]
    if(guildID.toLowerCase() === "this") guildID = message.guild.id
    client.premiumdb.prepare('DELETE FROM subscriptions WHERE guild_id = ?').run(guildID)
    message.channel.send(`Deactivated premium from \`${guildID}\``)
  }
}
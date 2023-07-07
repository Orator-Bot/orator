const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "showstats",
  description: "Send the stats of bot usage",
  ownerOnly: true,
  category: "dev",
  async execute(message, args, client) {
    const getTotalCommandUsage = () => {
      return client.statsdb.prepare("SELECT SUM(usage) as total FROM statsdb").get().total || 0
    }
    const getMostUsedCommand = () => {
      return client.statsdb.prepare("SELECT command, usage FROM statsdb ORDER BY usage DESC LIMIT 1").get()
    }

    message.channel.send({
      embeds: [new EmbedBuilder()
        .setColor(client.color)
        .setTitle("Total Bot Usage")
        .setDescription("This data is tracked since <t:1688748300:f>\n\n<:dot:1108430250003660831> Total Usage: **" + getTotalCommandUsage() + "** times.\n\n<:dot:1108430250003660831>Most Used Command: **" + getMostUsedCommand().command + "** - Used **" + getMostUsedCommand().usage + "** times.")
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        ]
    })
  }
}
const { EmbedBuilder, WebhookClient } = require("discord.js")

module.exports = {
  name: "guildDelete",
  async execute(guild, client) {
    const webhookURL = "https://discord.com/api/webhooks/1126035872333176852/r442DUc_uycchUhkgEEq1L4ICjppfPLOpJ1R0Lr8-MSRruL2GrT1Ad_Vmvl8gHldsD-k"
    const webhook = new WebhookClient({
      url: webhookURL
    })
    const promises = [
    	client.cluster.fetchClientValues("guilds.cache.size"),
    	client.cluster.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
    ];
    Promise.all(promises)
      .then(async results => {
        const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0)
        const embed = new EmbedBuilder()
          .setTitle(`Left ${guild.name}`)
          .setColor('Red')
          .setThumbnail(guild.iconURL())
          .addFields({
            name: 'Guild Name',
            value: `${guild.name}`
          }, {
            name: 'Guild ID',
            value: `${guild.id}`
          }, {
            name: 'Owner ID',
            value: `${guild.ownerId}`
          }, {
            name: 'Members Count',
            value: `${guild.memberCount} members`
          })
          .setTimestamp()
          
          await webhook.send({
            embeds: [embed]
          })
      })
  }
}
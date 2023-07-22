const { EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
  name: "guildDelete",
  async execute(guild, client) {
    const webhookURL =
      "https://discord.com/api/webhooks/1126035872333176852/r442DUc_uycchUhkgEEq1L4ICjppfPLOpJ1R0Lr8-MSRruL2GrT1Ad_Vmvl8gHldsD-k";
    const webhook = new WebhookClient({
      url: webhookURL,
    });
    const embed = new EmbedBuilder()
      .setTitle(`Left ${guild.name}`)
      .setColor("Red")
      .setThumbnail(guild.iconURL())
      .addFields(
        {
          name: "Guild Name",
          value: `${guild.name}`,
        },
        {
          name: "Guild ID",
          value: `${guild.id}`,
        },
        {
          name: "Owner ID",
          value: `${guild.ownerId}`,
        },
        {
          name: "Members Count",
          value: `${guild.memberCount} members`,
        }
      )
      .setTimestamp();

    await webhook.send({
      embeds: [embed],
    });
  },
};

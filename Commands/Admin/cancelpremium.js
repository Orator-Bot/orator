const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { stripIndent } = require("common-tags");
module.exports = {
  name: "cancelpremium",
  description: "Cancel the premium of your server",
  premium: true,
  async execute(message, args, client) {
    const row = new ActionRowBuilder();
    const confirmButton = new ButtonBuilder()
      .setLabel("Confirm")
      .setCustomId("confirm-cancel")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("<:Tick:1035765324693385226>");

    const cancelButton = new ButtonBuilder()
      .setLabel("Cancel")
      .setCustomId("cancel-cancel")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("<:Cross:1108433508633940068>");

    row.addComponents(confirmButton, cancelButton);
    const components = [row];

    const embed = new EmbedBuilder()
      .setTitle("Cancel Premium - " + message.guild.name)
      .setColor(client.color)
      .setDescription(
        stripIndent`
      By confirming this embed, I hereby accept that by being an admin/owner of ${message.guild.name}, I have discussed this with other server admins or owner about cancellation of premium in this server.
      
      ⚠️ If you cancel the premium, you won't get refunded for it, no matter which plan you bought. Though you may ask for a trial my opening a ticket in our server.
      
      ⚠️ Abuse of this server may result in permanent blacklist.
    `
      )
      .addFields({
        name: "Think carefully and click on a button:",
        value: "<:Tick:1035765324693385226> **Confirm** - To confirm and cancel the premium.\n<:Cross:1108433508633940068> **Cancel** - To abort this process.",
      })
      .setFooter({
        text: `Action Taken by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setThumbnail(message.guild.iconURL())
      .setTimestamp();

    const msg = await message.channel.send({
      embeds: [embed],
      components,
    });

    const collector = await msg.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      switch (interaction.customId) {
        case "confirm-cancel": {
          await interaction.update({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  "<:Tick:1035765324693385226> Cancellation Process Started..."
                ),
            ],
          });
        }
      }
    });
  },
};

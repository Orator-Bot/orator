const {
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const { stripIndent } = require("common-tags");

module.exports = {
  name: "setchannel",
  description: "Set the voice channel where only the bot can operate.",
  permissions: "Administrator",
  category: "config",
  async execute(message, args, client) {
    let currentChannel = "None";
    const dbData = client.getoratorvc.get(message.guild.id);
    if (dbData) currentChannel = `<#${dbData.channel}>`;

    const selectmenu = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder({
        channelTypes: [ChannelType.GuildVoice],
        customId: "select-channel",
        placeholder: "Select a Channel",
      })
    );

    const sentEmbed = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Set Orator Channel")
          .setDescription(
            stripIndent`
        🔊 Current Channel: ${currentChannel}
        
        > Select a channel which you want to set as the only TTS usable voice channel. Orator won't work in other voice channels.
        `
          )
          .setColor(client.color)
          .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL(),
          }),
      ],
      components: [selectmenu],
    });

    const collector = await sentEmbed.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 30000,
    });

    collector.on("collect", async (interaction) => {
      if (!interaction.isChannelSelectMenu()) return;
      const selectedChannel = interaction.values[0];
      client.setoratorvc.run(message.guild.id, selectedChannel);
      await interaction.deferUpdate();
      await sentEmbed.edit({
        embeds: [
          new EmbedBuilder()
            .setTitle("Set Orator Channel - Success")
            .setColor(client.color)
            .setDescription(
              `Successfully set <#${selectedChannel}> as the orator channel.`
            ),
        ],
        components: [],
      });
    });
  },
};

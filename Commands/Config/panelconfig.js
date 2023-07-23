const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
module.exports = {
  name: "panelconfig",
  description: "Set the configuration of the panel",
  permissions: "Administrator",
  premium: true,
  category: "config",
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setTitle("Panel Configuration Menu")
      .setColor(client.color)
      .setDescription(
        "Panel Configurations Available:\n- Panel Voice API: *`Set the api of voice that is used in the panel`*\n- More options coming soon."
      )
      .setThumbnail(message.guild.iconURL())
      .setTimestamp();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select-menu")
      .setPlaceholder("Select an API to use in your Server's panel")
      .setMaxValues(1)
      .setOptions([
        {
          label: "Google TTS API",
          description: "Fastest and Default API used in the panel",
          value: "google",
        },
        {
          label: "Orator's Custom Male Voice API",
          description: "Use the best Male Voice API (Approx: 6 Sec)",
          value: "unreal",
        },
        {
          label: "Fakeyou Custom Voice API",
          description: "Use our custom voice API powered by Fakeyou (Slowest)",
          value: "fakeyou",
        },
      ]);

    const menu = new ActionRowBuilder().addComponents(selectMenu);

    const sentMsg = await message.channel.send({
      embeds: [embed],
      components: [menu],
    });

    const collector = await sentMsg.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      idle: 60000,
    });

    collector.on("collect", async (interaction) => {
      switch (interaction.customId) {
        case "select-menu": {
          await interaction.deferUpdate();
          const selectedItem = interaction.values[0];
          switch (selectedItem) {
            case "google":
              {
                await sentMsg.edit({
                  content:
                    "Successfully set the Voice API of Panel to *`Google TTS API`*.",
                  embeds: [],
                  components: [],
                });
                client.panelapi
                  .prepare(
                    "INSERT OR REPLACE INTO panelapi(guild, api) VALUES(?,?)"
                  )
                  .run(interaction.guild.id, selectedItem);
              }
              break;
            case "unreal":
              {
                await sentMsg.edit({
                  content:
                    "Successfully set the Voice API of Panel to *`Orator Male Voice API`*.",
                  embeds: [],
                  components: [],
                });
                client.panelapi
                  .prepare(
                    "INSERT OR REPLACE INTO panelapi(guild, api) VALUES(?,?)"
                  )
                  .run(interaction.guild.id, selectedItem);
              }
              break;
            case "fakeyou": {
              await sentMsg.edit({
                content:
                  "Successfully set the Voice API of Panel to *`Fakeyou Voice API}`*.",
                embeds: [],
                components: [],
              });
              client.panelapi
                .prepare(
                  "INSERT OR REPLACE INTO panelapi(guild, api) VALUES(?,?)"
                )
                .run(interaction.guild.id, selectedItem);
            }
          }
        }
      }
    });
  },
};

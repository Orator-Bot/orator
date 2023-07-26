const { ActionRowBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  name: "mttsvoice",
  description: "Change the Male Voice TTS Voice.",
  aliases: ["malettsvoice"],
  args: false,
  usage: "",
  permissions: "Administrator",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  category: "config",
  premium: true,
  async execute(message, args, client) {
    const maleVoiceButton = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("mtts-setvoice")
        .setPlaceholder("Set a Male voice")
        .setMaxValues(1)
        .setMinValues(1)
        .setOptions([
          {
            label: "Male 1",
            value: "male-0",
          },
          {
            label: "Male 2",
            value: "male-1",
          },
          {
            label: "Male 3",
            value: "male-2",
          },
          {
            label: "Male 4",
            value: "male-3",
          },
        ])
    );
    const msg = await message.channel.send({
      content: "Setup a custom Male Voice using the button below:",
      components: [maleVoiceButton],
    });

    const collector = await msg.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      idle: 60000,
    });

    collector.on("collect", async (interaction) => {
      switch (interaction.values[0]) {
        case "male-0":
          {
            client.maleapi
              .prepare(
                "INSERT OR REPLACE INTO maleapi(guild, voice) VALUES(?,?)"
              )
              .run(interaction.guild.id, "male-0");
            interaction.reply({
              content: "Successfully changed the male voice to: **Male 1**",
              ephemeral: true,
            });
          }
          break;
        case "male-1":
          {
            client.maleapi
              .prepare(
                "INSERT OR REPLACE INTO maleapi(guild, voice) VALUES(?,?)"
              )
              .run(interaction.guild.id, "male-1");
            interaction.reply({
              content: "Successfully changed the male voice to: **Male 2**",
              ephemeral: true,
            });
          }
          break;
        case "male-2":
          {
            client.maleapi
              .prepare(
                "INSERT OR REPLACE INTO maleapi(guild, voice) VALUES(?,?)"
              )
              .run(interaction.guild.id, "male-2");
            interaction.reply({
              content: "Successfully changed the male voice to: **Male 3**",
              ephemeral: true,
            });
          }
          break;
        case "male-3": {
          client.maleapi
            .prepare("INSERT OR REPLACE INTO maleapi(guild, voice) VALUES(?,?)")
            .run(interaction.guild.id, "male-3");
          interaction.reply({
            content: "Successfully changed the male voice to: **Male 4**",
            ephemeral: true,
          });
        }
      }
    });
  },
};

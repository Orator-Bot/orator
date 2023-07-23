module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (
      !["conf-spinfo", "conf-pause-unpause", "panel-event-unreal"].includes(
        interaction.customId
      )
    )
      return;
    if (!interaction.member.permissions.has("Administrator"))
      return interaction.reply({
        content: "You need Administrator permission to use the Buttons.",
        ephemeral: true,
      });
    if (interaction.customId === "conf-pause-unpause") {
      const panelDB = new client.database("./Database/panel.db");
      const pauseData = client.getpanel.get(interaction.guild.id);
      if (pauseData.action === "pause") {
        panelDB
          .prepare("UPDATE panel SET action = ? WHERE guild = ?")
          .run("unpause", interaction.guild.id);
        await interaction.reply({
          content: "Resumed the Panel.",
          ephemeral: true,
        });
      } else if (pauseData.action === "unpause") {
        panelDB
          .prepare("UPDATE panel SET action = ? WHERE guild = ?")
          .run("pause", interaction.guild.id);
        await interaction.reply({
          content: "Paused the Panel.",
          ephemeral: true,
        });
      }
    } else if (interaction.customId === "conf-spinfo") {
      const spDB = new client.database("./Database/panel.db");
      const spData = client.getpanel.get(interaction.guild.id);
      if (spData.speaker === "enabled") {
        spDB
          .prepare("UPDATE panel SET speaker = ? WHERE guild = ?")
          .run("disabled", interaction.guild.id);
        await interaction.reply({
          content: "Disabled Speaker Info.",
          ephemeral: true,
        });
      } else if (spData.speaker === "disabled") {
        spDB
          .prepare("UPDATE panel SET speaker = ? WHERE guild = ?")
          .run("enabled", interaction.guild.id);
        await interaction.reply({
          content: "Enabled the speaker info.",
          ephemeral: true,
        });
      }
    } else {
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
        case "male-3":
          {
            client.maleapi
              .prepare(
                "INSERT OR REPLACE INTO maleapi(guild, voice) VALUES(?,?)"
              )
              .run(interaction.guild.id, "male-3");
            interaction.reply({
              content: "Successfully changed the male voice to: **Male 4**",
              ephemeral: true,
            });
          }
          break;
      }
    }
  },
};

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

module.exports = {
  name: "customtts",
  description: "Get fake voice tts file.",
  args: true,
  premium: true,
  aliases: ["ctts"],
  category: "tts",
  async execute(message, args, client) {
    const text = args.join(" ");
    if (text.length <= 5)
      return message.reply(
        "TTS text must be greater than or equal to 5 and less than or equal to 150."
      );
    if (text.length >= 150)
      return message.reply(
        "TTS text must be greater than or equal to 5 and less than or equal to 150."
      );

    const allowRoleData = client.allowroledb
      .prepare("SELECT * FROM allowrole WHERE guild_id = ?")
      .get(message.guild.id);
    if (allowRoleData && allowRoleData.roles) {
      const memberRoles = message.member.roles.cache.map((role) => role.id);
      const allowedRoles = allowRoleData.roles.split(",");
      const hasWhitelistedRole = allowedRoles.some((role) =>
        memberRoles.includes(role)
      );
      if (!hasWhitelistedRole) {
        return message.reply(
          "You must have one of the **AllowRoles** to use this command.\nUse `.allowrole list` to check the roles."
        );
      }
    }

    const blacklistword = client.getblacklistword
      .all(message.guild.id)
      .map((row) => row.word);
    if (
      blacklistword.some((word) => text.toLowerCase().split(" ").includes(word))
    ) {
      await message.delete().catch((err) => {});
      return message.channel.send(
        `${message.author}, you have used a blacklisted word which isn't allowed.`
      );
    }

    const blacklistuser = client.getblacklistuser
      .all(message.guild.id, message.author.id)
      .map((row) => row.user_id);
    if (blacklistuser.includes(message.author.id)) {
      return message.channel.send(
        `${message.author}, you are blacklisted from using the TTS commands of the bot by a server admin. Contact the admins to remove the blacklist.`
      );
    }

    const roleIds = message.member.roles.cache.map((role) => role.id);
    const blacklistrole = client.getblacklistrole
      .all(message.guild.id)
      .map((row) => row.role_id);
    if (blacklistrole.some((roleId) => roleIds.includes(roleId))) {
      return message.reply(
        "You have a role which is blacklisted from using TTS commands."
      );
    }

    const waitMsg = await message.channel.send({
      content:
        "Please wait for some seconds, it takes some time to generate.\nApprox: `less than 30s`.",
      fetchReply: true,
    });
    message.channel.sendTyping();
    let voice = "TM:7wbtjphx8h8v";
    const cVoice = client.customVoiceDB.prepare("SELECT * FROM customLang WHERE guild = ?").get(message.guild.id);
    // const cVoice = client.customlang.get(message.guild.id);
    if (cVoice) voice = cVoice.sound;
    const tts = await client.fy.makeTTS(voice, `,${text}.`);
    const ttsURL = tts.audioURL();

    const voiceData = await client.fy.models.fetch(voice);
    const Embed = new EmbedBuilder()
      .setTitle("Custom Voice - Generated.")
      .setDescription(
        `📃 Text: \`${text}\`\n\n🔊 Voice: ${voiceData.title}\n\n🔹Click on Play after joining vc to play the audio.\n🔹Or click on the button below to get the Audio File.`
      )
      .setColor(client.color)
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();

    const playButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("⏯️ Play Audio")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("play-customaudio")
    );

    const linkButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("🔗 Get TTS File")
        .setStyle(ButtonStyle.Link)
        .setURL(ttsURL)
    );

    const disabledPlayButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("⏯️ Played in VC")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("play-audio-disabled")
        .setDisabled()
    );
    const sentEmbed = await message.channel.send({
      embeds: [Embed],
      components: [playButton, linkButton],
    });

    await waitMsg.delete();

    const collector = await sentEmbed.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 60000,
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId !== "play-customaudio") return;
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        return interaction.reply({
          content: "You aren't in a voice channel.",
          ephemeral: true,
        });
      }
      const channelData = client.getoratorvc.get(interaction.guild.id);
      if (channelData) {
        if (voiceChannel.id !== channelData.channel)
          return interaction.reply({
            content: `I'm only allowed to join: <#${channelData.channel}>`,
            ephemeral: true,
          });
      }

      try {
        await client.player.play(voiceChannel, ttsURL, {
          nodeOptions: {
            leaveOnEnd: false,
          },
        });
        await interaction.deferUpdate();
        await sentEmbed.edit({
          embeds: [
            new EmbedBuilder()
              .setTitle("Custom Voice - Played.")
              .setDescription(
                `📃 Text: \`${text}\`\n\n🔊 Voice: ${voiceData.title}\n\n🔹Click on the button below to get the Audio File.`
              )
              .setColor(client.color)
              .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
          components: [disabledPlayButton, linkButton],
        });
        const logsChannel = client.ttslogs.get(interaction.guild.id);
        if (logsChannel) {
          await interaction.guild.channels.cache
            .get(logsChannel.channel)
            .send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Custom TTS Played")
                  .setAuthor({
                    name: interaction.user.tag + " played Custom TTS.",
                    iconURL: interaction.user.displayAvatarURL(),
                  })
                  .setDescription(`\`\`\`${text}\`\`\``)
                  .setColor(client.color)
                  .setTimestamp()
                  .setFooter({
                    text: `Used in #${interaction.channel.name}`,
                  }),
              ],
            })
            .catch(() => {});
        }
      } catch (error) {
        return interaction.channel.send({
          content: "Something went wrong",
          ephemeral: true,
        });
      }
    });
  },
};

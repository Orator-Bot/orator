const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const { Player, QueryType, useQueue } = require("discord-player");
const googleTTS = require("google-tts-api");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tts")
    .setDescription("Use the text to speech in a voice channel.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription(
          "Enter the text to convert to speech in a voice channel"
        )
        .setRequired(true)
        .setMaxLength(200)
        .setMinLength(5)
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    const text = interaction.options.getString("text");
    if (text.length > 200) {
      return interaction.reply({
        content: "The text must be less than 200 characters.",
        ephemeral: true,
      });
    }
    let langCode = "en";
    const hasCustomLang = client.getlang.get(interaction.guild.id);
    if (hasCustomLang) {
      langCode = hasCustomLang.lang;
    }
    try {
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        return interaction.reply({
          content: "You're not in a voice channel",
          ephemeral: true,
        });
      }
      const allowRoleData = client.allowroledb
        .prepare("SELECT * FROM allowrole WHERE guild_id = ?")
        .get(interaction.guild.id);
      if (allowRoleData && allowRoleData.roles) {
        const memberRoles = interaction.member.roles.cache.map(
          (role) => role.id
        );
        const allowedRoles = allowRoleData.roles.split(",");
        const hasWhitelistedRole = allowedRoles.some((role) =>
          memberRoles.includes(role)
        );
        if (!hasWhitelistedRole) {
          return interaction.reply({
            content:
              "You must have one of the **AllowRoles** to use this command.\nUse `.allowrole list` to check the roles.",
            ephemeral: true,
          });
        }
      }
      const channelData = client.getoratorvc.get(interaction.guild.id);
      if (channelData) {
        if (voiceChannel.id !== channelData.channel)
          return interaction.reply({
            content: `I am only allowed to join <#${channelData.channel}>`,
          });
      }
      const blacklistword = client.getblacklistword
        .all(interaction.guild.id)
        .map((row) => row.word);
      if (
        blacklistword.some((word) =>
          text.toLowerCase().split(" ").includes(word)
        )
      ) {
        return interaction.reply({
          content: `${interaction.user}, you have used a blacklisted word.`,
          ephemeral: true,
        });
      }
      const blacklistuser = client.getblacklistuser
        .all(interaction.guild.id, interaction.user.id)
        .map((row) => row.user_id);
      if (blacklistuser.includes(interaction.user.id)) {
        return interaction.reply({
          content: `${interaction.user}, you are blacklisted from using the TTS commands of the bot by a server admin. Contact the admins to remove the blacklist.`,
          ephemeral: true,
        });
      }

      const roleIds = interaction.member.roles.cache.map((role) => role.id);
      const blacklistrole = client.getblacklistrole
        .all(interaction.guild.id)
        .map((row) => row.role_id);
      if (blacklistrole.some((roleId) => roleIds.includes(roleId))) {
        return interaction.reply({
          content:
            "You have a role which is blacklisted from using TTS commands.",
          ephemeral: true,
        });
      }
      const url = googleTTS.getAudioUrl(text, {
        lang: langCode,
        slow: false,
        host: "https://translate.google.com",
      });
      await client.player.play(voiceChannel, url, {
        nodeOptions: {
          leaveOnEnd: false,
        },
      });
      await interaction.reply({
        content: "Speaking your text now.",
        ephemeral: true,
      });
      await interaction.channel.send({
        content: `[${langCode}] 🎙️ ${interaction.user.username} said: **${text}**`,
      });
      const logsChannel = client.ttslogs.get(interaction.guild.id);
      if (logsChannel) {
        const sendchannel = await interaction.guild.channels.cache
          .get(logsChannel.channel)
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle("TTS Command")
                .setAuthor({
                  name: interaction.user.username + " used TTS command.",
                  iconURL: interaction.user.displayAvatarURL(),
                })
                .setDescription(`\`\`\`${text}\`\`\``)
                .setColor("#486FFA")
                .setTimestamp()
                .setFooter({
                  text: `Used in #${interaction.channel.name}`,
                }),
            ],
          })
          .catch((err) => {});
      }
    } catch (error) {
      client.logger(error, "error");
      return interaction.reply({
        content: "[TIMEOUT]: TTS Command timed-out.",
        ephemeral: true,
      });
    }
  },
};

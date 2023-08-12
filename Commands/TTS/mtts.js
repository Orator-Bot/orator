const { Player, QueryType, useQueue } = require("discord-player");
const googleTTS = require("google-tts-api");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "mtts",
  description: "Male Text to speech command.",
  args: true,
  premium: true,
  usage: "<text>",
  aliases: ["maletts"],
  category: "tts",
  voteOnly: true,
  async execute(message, args, client) {
    const text = args.join(" ");
    let langCode = "en";
    if (text.length > 200) {
      return message.reply("Message must not exceed 200 characters.");
    }
    const hasCustomLang = client.getlang.get(message.guild.id);
    if (hasCustomLang) {
      langCode = hasCustomLang.lang;
    }
    try {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        return message.reply({
          content: "You aren't in a voice channel.",
        });
      }
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
      const channelData = client.getoratorvc.get(message.guild.id);
      if (channelData) {
        if (voiceChannel.id !== channelData.channel)
          return message.reply(
            `I'm only allowed to join: <#${channelData.channel}>`
          );
      }

      const blacklistword = client.getblacklistword
        .all(message.guild.id)
        .map((row) => row.word);
      if (
        blacklistword.some((word) =>
          text.toLowerCase().split(" ").includes(word)
        )
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

      const waitMessage = await message.channel.send(
        "Please wait for the Voice Generation to complete. [API: Orator Male Voice]"
      );

      await message.channel.sendTyping();
      const apiKey = client.config.UnrealToken;
      const apiUrl = "https://api.v5.unrealspeech.com/speech";
      const voiceId = "male-0";
      const requestData = {
        Text: text,
        VoiceId: voiceId,
        OutputFormat: "uri",
        AudioFormat: "mp3",
        Bitrate: "192k",
      };
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
      axios.post(apiUrl, requestData, { headers }).then(async (response) => {
        const url = response.data;
        await client.player.play(voiceChannel, url, {
          nodeOptions: {
            leaveOnEnd: false,
          },
        });
        await message.channel
          .send(
            `(**\`Orator Male API\`**) [${message.author.username} said]: ${text}`
          )
          .then(async () => {
            await waitMessage.delete();
          });
      });
      const logsChannel = client.ttslogs.get(message.guild.id);
      if (logsChannel) {
        const sendchannel = await message.guild.channels.cache
          .get(logsChannel.channel)
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle("TTS Command")
                .setAuthor({
                  name: message.author.tag + " used TTS command.",
                  iconURL: message.author.displayAvatarURL(),
                })
                .setDescription(`\`\`\`${text}\`\`\``)
                .setColor("#486FFA")
                .setTimestamp()
                .setFooter({
                  text: `Used in #${message.channel.name}`,
                }),
            ],
          })
          .catch((err) => {});
      }
    } catch (err) {
      console.log(err);
      message.reply({
        content: `[${client.time}]: TTS Timed-Out. Try again!`,
      });
    }
  },
};

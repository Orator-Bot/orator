const { Player, QueryType, useQueue } = require("discord-player");
const googleTTS = require("google-tts-api");
const { EmbedBuilder } = require("discord.js");
const adsArray = require("../../Structures/Advertisement.json");

module.exports = {
  name: "tts",
  description: "Text to speech command.",
  args: true,
  usage: "<text>",
  aliases: ["speak"],
  category: "tts",
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

      const adIndex = Math.floor(
        Math.random(adsArray.ads) * adsArray.ads.length
      );
      const adText = adsArray.ads[adIndex];

      await message.channel.send({
        content: `[${langCode}] 🎙️ ${message.author.tag} said: **${text}**\n\n:mailbox_with_mail: ${adText}`,
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

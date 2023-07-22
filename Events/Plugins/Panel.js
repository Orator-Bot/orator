const ms = require("ms");
const googleTTS = require("google-tts-api");
const { Player, QueryType } = require("discord-player");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.id === client.user.id) return;
    if (!message.guild.id) return;
    const data = client.premiumdb
      .prepare("SELECT * FROM subscriptions WHERE guild_id = ?")
      .get(message.guild.id);
    if (!data) return;
    const panelData = client.getpanel.get(message.guild.id);
    if (!panelData) return;
    if (message.channel.id !== panelData.channel) return;
    let text = message.content;
    await message.delete().catch(() => {
      message
        .reply(
          "Error: Can't delete the message due to **Missing Permissions**."
        )
        .then(async (m) => {
          setTimeout(async () => {
            await m.delete();
          }, 3000);
        });
    });
    let speakerMember;
    if (message.webhookId === null) {
      speakerMember = message.author.username;
    } else {
      speakerMember = message.member.displayName;
    }
    if (panelData.action === "pause")
      return message.channel.send("The panel is currently paused.");
    if (panelData.speaker === "enabled")
      text = speakerMember + " said " + message.content;
    let langCode = "en";
    const langData = client.getlang.get(message.guild.id);
    if (langData) langCode = langData.lang;
    const userVC = message.member.voice.channel;
    const botVC = message.guild.members.me.voice.channel;
    if (message.webhookId === null) {
      if (!userVC)
        return message.channel
          .send("You must be in a voice channel.")
          .then(async (m) => {
            setTimeout(async () => {
              await m.delete();
            }, 5000);
          });
    }
    const channelData = client.getoratorvc.get(message.guild.id);
    if (channelData) {
      if (userVC.id !== channelData.channel)
        return message.channel
          .send(`I can only join <#${channelData.channel}>.`)
          .then(async (m) => {
            setTimeout(async () => {
              await m.delete();
            }, 5000);
          });
    }
    const blacklistword = client.getblacklistword
      .all(message.guild.id)
      .map((row) => row.word);
    if (
      blacklistword.some((word) => text.toLowerCase().split(" ").includes(word))
    ) {
      await message.delete().catch((err) => {});
      return message.channel
        .send(
          `${message.author}, you have used a blacklisted word which isn't allowed.`
        )
        .then(async (m) => {
          setTimeout(async () => {
            await m.delete();
          }, 5000);
        });
    }
    const blacklistuser = client.getblacklistuser
      .all(message.guild.id, message.author.id)
      .map((row) => row.user_id);
    if (blacklistuser.includes(message.author.id)) {
      return message.channel
        .send(
          `${message.author}, you are blacklisted from using the TTS commands of the bot by a server admin. Contact the admins to remove the blacklist.`
        )
        .then(async (m) => {
          setTimeout(async () => {
            await m.delete();
          }, 5000);
        });
    }
    const roleIds = message.member.roles.cache.map((role) => role.id);
    const blacklistrole = client.getblacklistrole
      .all(message.guild.id)
      .map((row) => row.role_id);
    if (blacklistrole.some((roleId) => roleIds.includes(roleId))) {
      return message
        .reply("You have a role which is blacklisted from using TTS commands.")
        .then(async (m) => {
          setTimeout(async () => {
            await m.delete();
          }, 5000);
        });
    }
    if (message.webhookId === null) {
      if (botVC) {
        if (userVC !== botVC)
          return message.channel
            .send(`${client.user.username} is currently in <#${botVC.id}>.`)
            .then(async (m) => {
              setTimeout(async () => {
                await m.delete();
              }, 5000);
            });
      }
    }
    const url = googleTTS.getAudioUrl(text, {
      lang: langCode,
      slow: false,
      host: "https://translate.google.com",
    });
    await client.player.play(userVC, url, {
      nodeOptions: {
        leaveOnEnd: false,
      },
    });
    await message.channel
      .send(`[${message.author.tag} said]: ${text}`)
      .then(async (m) => {
        setTimeout(async () => {
          await m.delete();
        }, 5000);
      });
    const logData = client.ttslogs.get(message.guild.id);
    if (logData) {
      const logChannel = message.guild.channels.cache.get(logData.channel);
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: message.author.tag + " used Panel",
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription("```\n" + text + "\n```")
        .setColor(client.color)
        .setTimestamp()
        .setFooter({
          text: `${client.user.username} Logs`,
        });
      const logButton = new ButtonBuilder()
        .setLabel("Go to Panel")
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://discord.com/channels/${message.guild.id}/${message.channel.id}`
        );
      const logRow = new ActionRowBuilder().addComponents(logButton);
      await logChannel
        .send({
          embeds: [logEmbed],
          components: [logRow],
        })
        .catch(() => null);
    }
  },
};

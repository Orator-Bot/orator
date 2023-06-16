const { Player, QueryType, useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "soundboard",
  description: "Use soundboard in vc.",
  args: true,
  usage: "<sound>",
  aliases: ["sb"],
  category: "tts",
  async execute(message, args, client) {
    const SoundName = args[0];
    const state = client.sbstate.prepare("SELECT * FROM sbstates WHERE guild = ?").get(message.guild.id);
    if (state) {
      return message.reply("Soundboard was disabled in this server. Use \`toggle-soundboard\` to enable it.");
    }
    try {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        return message.reply({
          content: "You aren't in a voice channel.",
        });
      }
      const allowRoleData = client.allowroledb.prepare('SELECT * FROM allowrole WHERE guild_id = ?').get(message.guild.id)
      if (allowRoleData && allowRoleData.roles) {
        const memberRoles = message.member.roles.cache.map((role) => role.id);
        const allowedRoles = allowRoleData.roles.split(',');
        const hasWhitelistedRole = allowedRoles.some((role) => memberRoles.includes(role));
        if (!hasWhitelistedRole) {
          return message.reply(`You must have one of the **AllowRoles** to use this command.\nUse \`.allowrole list\` to check the roles.`)
        }
      }
      const channelData = client.getoratorvc.get(message.guild.id);
      if (channelData) {
        if (voiceChannel.id !== channelData.channel) return message.reply(`I'm only allowed to join: <#${channelData.channel}>`);
      }

      const url = `https://arijit.site/sounds/${SoundName.toLowerCase()}.mp3`;

      await client.player.play(voiceChannel, url, {
        nodeOptions: {
          leaveOnEnd: false
        },
      });
      await message.channel.send({
        content: `🥁 ${message.author.tag} played **${SoundName}**`
      });
    } catch (err) {
      return message.reply({
        content: `:x: No sounds with name: \`${SoundName}\` is found!`,
      });
    }
  }
};
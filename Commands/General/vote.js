const {
  Message,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const topgg = require("@top-gg/sdk");

module.exports = {
  name: "vote",
  description: "Vote Orator Bot.",
  aliases: [],
  args: false,
  usage: "",
  permissions: "",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  category: "general",
  premium: false,
  voteOnly: false,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const api = new topgg.Api(client.config.TOPGGTOKEN);
    const hasVoted = await api.hasVoted(message.author.id);

    if (hasVoted === true) {
      await message.channel.send({
        content:
          "You have voted in the last 12 hours. Please check again later.",
      });
    } else {
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Vote Orator")
            .setDescription(
              "You haven't voted in the last 12 hours. Please vote by clicking the button below:"
            )
            .setTimestamp()
            .setColor(client.color)
            .setThumbnail(client.user.displayAvatarURL()),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Vote Orator")
              .setStyle(ButtonStyle.Link)
              .setURL("https://top.gg/bot/948637316145102868/vote")
          ),
        ],
      });
    }
  },
};

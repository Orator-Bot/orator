const { EmbedBuilder } = require("discord.js");
const { stripIndent } = require("common-tags");
module.exports = {
  name: "links",
  category: "general",
  description: "Important Orator Links",
  async execute(message, args, client) {
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.color)
          .setTitle(client.user.username + " Links").setDescription(stripIndent`
                  <:dot_red:1064544315948400740> Website: https://oratorbot.xyz
                  <:dot_red:1064544315948400740> Developer Site: https://dev.oratorbot.xyz
                  <:dot_red:1064544315948400740> Invite Orator: https://oratorbot.xyz/invite
                  <:dot_red:1064544315948400740> Support: https://oratorbot.xyz/support
                  <:dot_red:1064544315948400740> Vote Orator: https://top.gg/bot/948637316145102868
      `),
      ],
    });
  },
};

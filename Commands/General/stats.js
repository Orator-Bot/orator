const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
module.exports = {
  name: "stats",
  description: "Shows the stats of the bot.",
  category: "general",
  async execute(message, args, client) {
    const promises = [
      client.cluster.fetchClientValues("guilds.cache.size"),
      client.cluster.broadcastEval((c) =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      ),
    ];

    Promise.all(promises).then(async (result) => {
      const totalGuilds = result[0].reduce(
        (acc, guildCount) => acc + guildCount,
        0
      );
      const totalMembers = result[1].reduce(
        (acc, memberCount) => acc + memberCount,
        0
      );
      const getTotalCommandUsage = () => {
        return (
          client.statsdb
            .prepare("SELECT SUM(usage) as total FROM statsdb")
            .get().total || 0
        );
      };

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle("Bot Stats")
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          {
            name: "Total Servers",
            value: `→ ${totalGuilds} guilds`,
          },
          {
            name: "Total Users",
            value: `→ ${totalMembers} members`,
          },
          {
            name: "Total Commands Used",
            value: `→ ${getTotalCommandUsage()} times\n[Since <t:1688748300:f>]`,
          },
          {
            name: "Total Commands",
            value: `→ ${
              client.legacy.filter((c) => !c.ownerOnly).size
            } commands`,
          },
          {
            name: "Total Clusters",
            value: `→ ${client.cluster.count}`,
          },
          {
            name: "Total Shards",
            value: `→ ${client.cluster.info.TOTAL_SHARDS}`,
          }
        )
        .setFooter({
          text: `💙 Team ${client.user.username}`,
        });

      const button = new ButtonBuilder()
        .setLabel("Orator Site")
        .setURL("https://oratorbot.xyz")
        .setStyle(ButtonStyle.Link);

      const button2 = new ButtonBuilder()
        .setLabel("Orator Server")
        .setURL("https://discord.gg/TeS3haQ4tT")
        .setStyle(ButtonStyle.Link);

      const buttons = new ActionRowBuilder().addComponents(button, button2);

      await message.channel.send({
        embeds: [embed],
        components: [buttons],
      });
    });
  },
};

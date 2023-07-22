const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "maxmembers",
  description: "Get max members server ID",
  aliases: ["maxmember"],
  ownerOnly: true,
  category: "dev",
  async execute(message, args, client) {
    let maxMembers = 0;
    let maxMembersServerId = "";
    client.guilds.cache.forEach((guild) => {
      if (guild.memberCount > maxMembers) {
        maxMembers = guild.memberCount;
        maxMembersServerId = guild.id;
      }
    });
    const server = client.guilds.cache.get(maxMembersServerId);
    const owner = await client.users.fetch(server.ownerId).then((u) => u.tag);
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: server.name,
        iconURL: server.iconURL(),
      })
      .addFields(
        {
          name: "ID",
          value: `${server.id}`,
          inline: true,
        },
        {
          name: "Member Count",
          value: `${server.memberCount}`,
          inline: true,
        },
        {
          name: "Owner",
          value: `[${owner}](https://discord.com/users/${server.ownerId}) [ID: \`${server.ownerId}\`]`,
          inline: true,
        }
      )
      .setTimestamp()
      .setThumbnail(server.iconURL());

    message.channel.send({
      content: `The server with most members in Cluster ${client.cluster.id}:`,
      embeds: [embed],
    });
  },
};

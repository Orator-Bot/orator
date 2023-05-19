const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");
const MAX_PER_PAGE = 5;
module.exports = {
  name: "serverlist",
  description: "Lists all/matching servers",
  ownerOnly: true,
  async execute(message, args, client) {
    const { channel, member } = message;
    const matched = [];
    const match = args.join(" ") || null;
    if (match) {
      if (client.guilds.cache.has(match)) {
        matched.push(client.guilds.cache.get(match));
      }

      client.guilds.cache
        .filter((g) => g.name.toLowerCase().includes(match.toLowerCase()))
        .forEach((g) => matched.push(g));
    }

    const servers = match ? matched : Array.from(client.guilds.cache.values());
    const total = servers.length;
    const maxPerPage = MAX_PER_PAGE;
    const totalPages = Math.ceil(total / maxPerPage);

    if (totalPages === 0) return message.channel.send("No servers found");
    let currentPage = 1;

    let components = [];
    components.push(
      new ButtonBuilder().setCustomId("prevBtn").setEmoji("⬅️").setStyle(ButtonStyle.Secondary).setDisabled(true),
      new ButtonBuilder()
      .setCustomId("nxtBtn")
      .setEmoji("➡️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(totalPages === 1)
    );
    let buttonsRow = new ActionRowBuilder().addComponents(components);

    const buildEmbed = () => {
      const start = (currentPage - 1) * maxPerPage;
      const end = start + maxPerPage < total ? start + maxPerPage : total;

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: "List of servers" })
        .setFooter({ text: `${match ? "Matched" : "Total"} Servers: ${total} • Page ${currentPage} of ${totalPages}` });

      const fields = [];
      for (let i = start; i < end; i++) {
        const server = servers[i];
        fields.push({
          name: server.name,
          value: `**ID:** ${server.id}\n**Owner ID:** ${server.ownerId}\n**Members:** ${server.memberCount}`,
          inline: true,
        });
      }
      embed.addFields(fields);

      let components = [];
      components.push(
        ButtonBuilder.from(buttonsRow.components[0]).setDisabled(currentPage === 1),
        ButtonBuilder.from(buttonsRow.components[1]).setDisabled(currentPage === totalPages)
      );
      buttonsRow = new ActionRowBuilder().addComponents(components);
      return embed;
    };

    const embed = buildEmbed();
    const sentMsg = await channel.send({ embeds: [embed], components: [buttonsRow] });

    const collector = channel.createMessageComponentCollector({
      filter: (reaction) => reaction.user.id === member.id && reaction.message.id === sentMsg.id,
      idle: 1 * 10000,
      dispose: true,
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (response) => {
      if (!["prevBtn", "nxtBtn"].includes(response.customId)) return;
      await response.deferUpdate();
      switch (response.customId) {
        case "prevBtn":
          if (currentPage > 1) {
            currentPage--;
            const embed = buildEmbed();
            await sentMsg.edit({ embeds: [embed], components: [buttonsRow] });
          }
          break;
        case "nxtBtn":
          if (currentPage < totalPages) {
            currentPage++;
            const embed = buildEmbed();
            await sentMsg.edit({ embeds: [embed], components: [buttonsRow] });
          }
          break;
      }
      collector.on("end", async () => {
        await sentMsg.edit({ components: [] });
      });
    });
  },
};
const { Pagination } = require("pagination.djs");
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { stripIndent } = require("common-tags");
module.exports = {
  name: "help",
  description: "Get the command info of Orator.",
  usage: "<command name>",
  async execute(message, args, client) {
    let prefix = ".";
    const prefixData = client.prefix.get(message.guild.id);
    if (prefixData) prefix = prefixData.prefix;

    if (!args.length) {
      const addEmojiInDescription = (c) => {
        return `<:iconDown:1029750030875234395> ${c.description || "No description provided"}`;
      };
      
      const allCommands = [
     ...client.legacy.filter((c) => !c.ownerOnly).values()
     ];
      const allCommandNames = allCommands.map((c) => c.name);

      const embed = new EmbedBuilder()
        .setTitle(`${client.user.username} - Help Command`)
        .setColor(client.color)
        .setTimestamp()
        .setDescription(stripIndent`
      Get the information about the commands of ${client.user.username}
      
      <a:right:1108683486732234802> **__Information__**
      <:dot:1108430250003660831> Total Commands: ${client.legacy.filter((c) => !c.ownerOnly).size}
      <:dot:1108430250003660831> Prefix in this server: ${prefix}
      <:dot:1108430250003660831> Use \`${prefix}help <command name>\` to get more information about the command.
      
      <a:right:1108683486732234802> **__Categories__**
      <:iconDown:1029750030875234395> General
      <:iconDown:1029750030875234395> Admin
      <:iconDown:1029750030875234395> Config
      <:iconDown:1029750030875234395> Text to Speech
      <:iconDown:1029750030875234395> Join to Create
      
      <a:right:1108683486732234802> **__Support Us__**
      <:review:1029746473560199299> [Get Premium](https://discord.gg/93dCvuY4RS)
      <:review:1029746473560199299> [Donate and support the development](https://donatebot.io/checkout/723535438186414160?buyer=842620032960823327)
      `)
        .setThumbnail(client.user.displayAvatarURL());
        
      const row = new ActionRowBuilder();
      const linkRow = new ActionRowBuilder();
      
      const voteButton = new ButtonBuilder()
      .setLabel("Vote Me")
      .setStyle(ButtonStyle.Link)
      .setURL("https://top.gg/bot/948637316145102868/vote");
      
      const supportButton = new ButtonBuilder()
      .setLabel("Support Server")
      .setStyle(ButtonStyle.Link)
      .setURL("https://oratorbot.xyz/support");
      
      const rowMenu = new StringSelectMenuBuilder()
        .setPlaceholder("Select Category")
        .setCustomId("filter-help-menu")
        .setOptions(
        {
          label: "General",
          description: "Check the general commands.",
          value: "general",
          emoji: "📃"
        },
        {
          label: "Admin",
          description: "Check the admin commands.",
          value: "admin",
          emoji: "🔨",
        },
        {
          label: "Config",
          description: "Check the config commands.",
          value: "config",
          emoji: "⚙️",
        },
        {
          label: "Text to Speech",
          description: "Check the Text to Speech commands.",
          value: "tts",
          emoji: "🎙️",
        },
        {
          label: "Join to Create",
          description: "Check join to create vc commands.",
          value: "jointocreate",
          emoji: "🔊"
        })
        .setMinValues(1)
        .setMaxValues(5);

      row.setComponents(rowMenu);
      linkRow.setComponents(voteButton, supportButton);
      const components = [row, linkRow];

      const rawFields = [];

      for (const c of client.legacy.values()) {
        rawFields.push({
          name: `<:dot:1108430250003660831> ${prefix}${c.name}`,
          value: addEmojiInDescription(c),
          category: c.category,
          usage: c.usage || "No usage provided.",
        });
      }

      let fields = rawFields.sort((a, b) => {
        const aName = a.name;
        const bName = b.name;
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
      });

      const response = await message.channel.send({
        embeds: [embed],
        components
      });
      const user = message.member;
      const collector = response.createMessageComponentCollector({
        idle: 50000,
      });
      const pagination = new Pagination(message)
        .paginateFields()
        .addActionRows(components)
        .setColor(client.color)
        .setThumbnail(client.user.displayAvatarURL());

      pagination.buttons = {
        first: pagination.buttons.first,
        prev: pagination.buttons.prev,
        next: pagination.buttons.next,
        last: pagination.buttons.last,
      };

      let paginated = false;
      collector.on("collect", async (i) => {
        if (i.user.id !== user.id) {
          i.deferUpdate().catch(() => null);
          return;
        }
        if (!i.isStringSelectMenu()) return;
        if (i.customId.startsWith("filter")) {
          fields = rawFields.filter((field) => i.values.includes(field.category));
          pagination.currentPage = 1;
          const payload = pagination
            .setTitle(`${client.user.username} Help - ${i.values.join(", ")}`)
            .setFields(fields)
            .ready();
          await i.update(payload).catch(() => null);
          if (!paginated) {
            pagination.paginate(response);
            paginated = true;
          }
        }
      });
    } else {
      const command = args[0].toLowerCase();
      const cmd = client.legacy.get(command) ||
        client.legacy.find((c) => c.aliases && c.aliases.includes(command));
      const notFoundEmbed = new EmbedBuilder()
        .setDescription(`<:Cross:1108433508633940068> No such commands found: \`${command}\``)
        .setColor(client.color);

      if (!cmd) return message.channel.send({ embeds: [notFoundEmbed] });
      if (cmd.ownerOnly) {
        if (!client.config.owners.includes(message.author.id)) return message.channel.send({ embeds: [notFoundEmbed] });
      }
      if (cmd.beta) {
        const betaData = client.betadb.prepare("SELECT * FROM beta WHERE guild_id = ?").get(message.guild.id);
        if (!betaData) return message.channel.send({ embeds: [notFoundEmbed] });
      }
      if (cmd.hidden) return message.channel.send({ embeds: [notFoundEmbed] });

      const commandInfoEmbed = new EmbedBuilder()
        .setAuthor({ name: `Command Info: ${prefix}${command}` })
        .setColor(client.color)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(cmd.description)
        .setTimestamp();

      if (cmd.usage) {
        commandInfoEmbed.addFields({
          name: "__Usage__",
          value: `<:dot:1108430250003660831> \`${prefix}${command} ${cmd.usage}\``,
          inline: true
        });
      }
      if (cmd.premium === true) {
        commandInfoEmbed.addFields({
          name: "__Premium__",
          value: "<:dot:1108430250003660831> This command requires premium to use.",
          inline: true
        });
      }
      if (cmd.beta === true) {
        commandInfoEmbed.addFields({
          name: "__Beta__",
          value: "<:dot:1108430250003660831> This is a beta servers only command.",
          inline: true
        });
      }
      if (cmd.stop === true) {
        commandInfoEmbed.addFields({
          name: "__Maintenance__",
          value: "<:dot:1108430250003660831> This command is currently under maintenance.",
          inline: true
        });
      }
      message.channel.send({ embeds: [commandInfoEmbed] });
    }
  }
};
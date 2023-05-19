const { Pagination } = require("pagination.djs")
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder } = require("discord.js")
const { stripIndent } = require("common-tags")
module.exports = {
  name: "test",
  description: "test",
  ownerOnly: true,
  async execute(message, args, client) {
    let prefix = "."
    const prefixData = client.prefix.get(message.guild.id)
    if(prefixData) prefix = prefixData.prefix
    
    const addEmojiInDescription = (c) => {
      return `<:dot:1108430250003660831>  ${c.description || 'No description provided'}`;
    };
    const allCommands = [
     ...client.legacy.filter((c) => !c.ownerOnly).values()
     ]
    const allCommandNames = allCommands.map((c) => c.name)

    const embed = new EmbedBuilder()
      .setTitle(`${client.user.username} - Help Command`)
      .setColor(client.color)
      .setTimestamp()
      .setDescription(stripIndent`
      Get the information about the commands of ${client.user.username}
      
      <:dot:1108430250003660831> Total Commands: ${client.legacy.filter((c) => !c.ownerOnly).size}
      <:dot:1108430250003660831> Prefix: ${prefix}
      <:dot:1108430250003660831> Use \`${prefix}help <command name>\` to get more information about the command.
      
      **__Categories__**
      <:iconDown:1029750030875234395> General
      <:iconDown:1029750030875234395> Admin
      <:iconDown:1029750030875234395> Config
      <:iconDown:1029750030875234395> Text to Speech
      <:iconDown:1029750030875234395> Join to Create
      `)
      .setThumbnail(client.user.displayAvatarURL())
    const row = new ActionRowBuilder();
    const rowMenu = new StringSelectMenuBuilder()
      .setPlaceholder('Select Category')
      .setCustomId('filter-help-menu')
      .setOptions(
      {
        label: 'General',
        description: 'Check the general commands.',
        value: 'general',
        emoji: "📃"
      },
      {
        label: 'Admin',
        description: 'Check the admin commands.',
        value: 'admin',
        emoji: "🔨",
      },
      {
        label: 'Config',
        description: 'Check the config commands.',
        value: 'config',
        emoji: "⚙️",
      },
      {
        label: 'Text to Speech',
        description: 'Check the Text to Speech commands.',
        value: 'tts',
        emoji: "🎙️",
      },
      {
        label: 'Join to Create',
        description: 'Check join to create vc commands.',
        value: 'jointocreate',
        emoji: "🔊"
      })
      .setMinValues(1)
      .setMaxValues(5);

    row.setComponents(rowMenu);
    const components = [row];

    const rawFields = [];

    for (const c of client.legacy.values()) {
      rawFields.push({
        name: c.name,
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
    })
    const user = message.member;
    const collector = response.createMessageComponentCollector({
      idle: 50000,
    });
    const pagination = new Pagination(message)
      .paginateFields()
      .addActionRows(components)
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())

    pagination.buttons = {
      first: pagination.buttons.first,
      prev: pagination.buttons.prev,
      next: pagination.buttons.next,
      last: pagination.buttons.last,
    };

    let paginated = false;
    collector.on('collect', async (i) => {
      if (i.user.id !== user.id) {
        i.deferUpdate().catch(() => null);
        return;
      }
      if (!i.isStringSelectMenu()) return;
      if (i.customId.startsWith('filter')) {
        fields = rawFields.filter((field) => i.values.includes(field.category));
        pagination.currentPage = 1;
        const payload = pagination
          .setTitle(`${client.user.username} Help - ${i.values.join(', ')}`)
          .setFields(fields)
          .ready();
        await i.update(payload).catch(() => null);
        if (!paginated) {
          pagination.paginate(response);
          paginated = true;
        }
      }
    })
    collector.on('end', (collected) => {
      const msg = collected.first()?.message;
      msg?.edit({ components: [] }).catch(() => null);
    });
  }
}
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ChannelType,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  name: "setvcpanel",
  description: "Setup the Join to Create control panel.",
  permissions: "ManageServer",
  args: true,
  usage: "<channel id>",
  category: "jointocreate",
  async execute(message, args, client) {
    const channel = message.guild.channels.cache.get(args[0]);
    if (!channel)
      return message.reply("You have provided an invalid channel id.");

    const channelType = channel.type;
    if (channelType !== ChannelType.GuildText)
      return message.reply("The channel must be a Text Channel.");

    await message.delete();
    const Embed = new EmbedBuilder()
      .setAuthor({
        name: "Temporary Voice Dashboard",
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription("Click on the Button to Control your Temporary Channel")
      .setTimestamp()
      .setColor("#486FFA")
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL(),
      });
    const Menu = new StringSelectMenuBuilder()
      .setCustomId("Menu")
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder("Channel Management")
      .addOptions([
        {
          label: "Mute Everyone",
          value: "Mute",
          emoji: "1079515864891674694",
        },
        {
          label: "Unmute Everyone",
          value: "Unmute",
          emoji: "1079515872118444062",
        },
        {
          label: "Set User Limit",
          value: "Customize_UserLimit",
          emoji: "1084915797463404614",
        },
        {
          label: "Disconnect Everyone",
          value: "Disconnect",
          emoji: "1079515860516999290",
        },
        {
          label: "Delete Channel",
          value: "Delete_Channel",
          emoji: "1079515862928740363",
        },
      ]);

    const RowOne = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("1079515867374698538")
        .setLabel("Lock")
        .setCustomId("LockChannel"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("1079515869320855624")
        .setLabel("Unlock")
        .setCustomId("UnlockChannel"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("1084858277730455683")
        .setLabel("Hide")
        .setCustomId("HideChannel"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("1084859746605076480")
        .setLabel("Unhide")
        .setCustomId("UnhideChannel")
    );
    const RowTwo = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji("1085174405895835699")
        .setLabel("Manage Users")
        .setCustomId("UsersManager"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji("869507189553922061")
        .setLabel("Rename")
        .setCustomId("RenameChannel")
    );
    const RowThree = new ActionRowBuilder().addComponents([Menu]);
    await channel.send({
      embeds: [Embed],
      components: [RowOne, RowTwo, RowThree],
    });
  },
};

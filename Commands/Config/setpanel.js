const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType
} = require("discord.js");
const { stripIndent } = require("common-tags");
module.exports = {
  name: "setpanel",
  description: "Set a channel as the panel of Orator Bot.",
  permissions: ["Administrator"],
  premium: true,
  args: true,
  category: "config",
  usage: "<channel>",
  async execute(message, args, client) {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) return message.reply("Can't fetch that channel.");
    if (channel.type !== ChannelType.GuildText) return message.reply("The channel must be a text channel.");
    const panelEmbed = new EmbedBuilder()
      .setTitle("Orator Panel")
      .setDescription(stripIndent`
    Write something in the channel without command, Orator will speak that for you. (You must be in a vc)
    `)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.color)
      .setFooter({
        text: `TTS Panel System of ${message.guild.name}`,
        iconURL: message.guild.iconURL()
      });

    const PanelButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel("Change Language")
        .setCustomId("panel-change-language")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("<:topggTranslator:916114557250994236>"),
        new ButtonBuilder()
        .setLabel("Config")
        .setCustomId("panel-config")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("<:settings:1029746486155673640>")
      );
      


    try {
      await channel.send({
        embeds: [panelEmbed],
        components: [PanelButtons],
        fetchReply: true
      });
      await message.channel.send(`Successfully set Panel System in ${channel}`);
      client.setpanel.run(message.guild.id, channel.id, "unpause", "enabled");
    } catch (error) {
      return messsage.channel.send("Something went wrong, try re-checking my permissions to Send Messages and Embeds in " + channel + ".");
      console.log(error);
    }
  }
};
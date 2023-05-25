const {
  stripIndent
} = require("common-tags");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");
module.exports = {
  name: "guildinfo",
  description: "Get the premium information of the server.",
  aliases: ["gi"],
  category: "dev",
  ownerOnly: true,
  args: true,
  usage: "<guild id>",
  async execute(message, args, client) {
    
    const guildId = args[0]
    const guildName = await client.guilds.fetch(guildId).then(async g => await g.name)
    if(!guildName) return message.reply('Invalid ID.')
    const guildIcon = await client.guilds.fetch(guildId).then(async g => await g.iconURL())
    
    const getPremiumBtn = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel("Upgrade to Premium")
        .setEmoji("<a:__:1063829203117686895>")
        .setURL("https://discord.gg/TeS3haQ4tT")
        .setStyle(ButtonStyle.Link)
      );

    const data = client.premiumdb.prepare("SELECT * FROM subscriptions WHERE guild_id = ?").get(guildId);
    
    if (!data) {
      message.channel.send({
        embeds: [
        new EmbedBuilder()
      .setTitle(`${guildName} - Info`)
      .setDescription(stripIndent`
        ${guildName} don't have any active premium plans.
      `)
      .setThumbnail(guildIcon)
      .setColor(client.color)
      .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL()
          })
      .setTimestamp()
        ],
        components: [getPremiumBtn]
      });
    } else {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
      .setTitle(`${guildName} - Info`)
      .setDescription(stripIndent`
        <a:__:1063829203117686895> Premium is active in ${guildName}.
      `)
      .addFields({
            name: "Expires In:",
            value: ms(data.expires - Date.now(), {long: true})
          }, {
            name: "Boosted By:",
            value: `${data.user_id}`
          })
      .setColor(client.color)
      .setThumbnail(guildIcon)
      .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL()
          })
      .setTimestamp()
          ]
      });
    }
  }
};
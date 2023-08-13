const { Message, Client, WebhookClient, EmbedBuilder } = require("discord.js");
const code = require("voucher-code-generator");

module.exports = {
  name: "report",
  description: "Report something directly to Team Orator",
  aliases: [],
  args: true,
  usage: "<report>",
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
    const report = args.join(" ");
    const webhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1140128093248442439/SKU6R0qp1is1qWS1BPpKTwDmoVLRCic_ed8wG02X4J1E2SXKpV8ns9gp44z9We7jJ4IS",
    });

    const reportID = await code.generate({
      pattern: "report-####-####",
      charset: "alphanumeric",
    });

    const embed = new EmbedBuilder()
      .setDescription(`${report}`)
      .setAuthor({
        name: message.author.username + " submitted a new report",
        iconURL: message.author.displayAvatarURL(),
      })
      .setColor(client.color)
      .addFields({
        name: "The report was submitted from:",
        value: `${message.guild.name} - ${message.guild.id}`,
      })
      .setFooter({
        text: `Report ID: ${reportID[0].toLowerCase()} | ${message.author.id}`,
      });

    await webhook.send({
      embeds: [embed],
    });
    await message.author
      .send({
        content: `Report ID: **${reportID[0].toLowerCase()}**`,
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              "Your report was submitted successfully. Please wait untill the devs respond to your report.\nMake sure not to spam reports or submit any report for fun, it may lead to get yourself banned from using the bot."
            ),
        ],
      })
      .then(async () => {
        await message.react("✅");
      })
      .catch(async () => {
        await message.react("✅");
        await message.reply({
          content: `Your DM is closed | Report ID: **${reportID[0].toLowerCase()}**`,
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                "Your report was submitted successfully. Please wait untill the devs respond to your report.\nMake sure not to spam reports or submit any report for fun, it may lead to get yourself banned from using the bot."
              ),
          ],
        });
      });
  },
};

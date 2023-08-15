const { Message, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "event",
  description: "Orator Bot Event Code - 2308v",
  aliases: [],
  args: false,
  usage: "",
  permissions: "",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  stop: true,
  category: "general",
  premium: false,
  voteOnly: false,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTitle("Orator Voting Event")
      .setDescription(
        "Introducing **Voting Event**:\nIn this event you'll vote Orator every 12 hours. The top 5 winners will get rewards"
      )
      .addFields(
        {
          name: "Rewards:",
          value:
            "1st. One Year Premium - Free\n2nd. 3 Months Premium - Free\n3rd. 1 Month Premium - Free\n4th. 50% Discount on Lifetime and Yearly Plans\n5th. 25% Discount on Lifetime and Yearly plans.",
        },
        {
          name: "Eligibility:",
          value:
            "1. You must take part in the event only from a single account.\n2. You must collect atleast 10 votes.",
        }
      )
      .setColor(client.color)
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL());

    message.channel.send({
      embeds: [embed],
    });
  },
};

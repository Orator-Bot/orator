const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "send",
  description: "Send something to a user",
  ownerOnly: true,
  args: true,
  usage: "<user> <message>",
  async execute(message, args, client) {
    const user = message.mentions.members.first()?.id || args[0];
    const msg = args.slice(1).join(" ");

    try {
      await client.users.send(user, {
          content: `${msg}`
        })
        .then(async () => {
          await message.channel.send({
            embeds: [
          new EmbedBuilder()
          .setDescription("✅ Successfully sent the message to the user.")
          .setColor(client.color)
        ]
          })
        })
        .catch(async (err) => {
          embeds: [
        new EmbedBuilder()
        .setDescription(`Error occured: ${err.message}`)
        .setColor("Red")
        ]
        })
    } catch (error) {
      await message.reply(`${error.message}`)
    }
  }
}
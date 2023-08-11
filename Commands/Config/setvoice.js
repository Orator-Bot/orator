const data = require("#root/Structures/CustomVoices.js");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "setvoice",
  description: "Set a custom voice",
  args: true,
  usage: "<voice name>",
  category: "config",
  premium: true,
  aliases: ["customvoice", "cv", "sv", "setcustomvoice"],
  async execute(message, args, client) {
    const voice = data.find((v) => v.value === args[0].toLowerCase());
    if (!voice) {
      return message.reply(
        "You have entered an invalid voice. Use `.voices` to check the available voices."
      );
    } else {
      client.setcustomlang.run(message.guild.id, message.author.id, voice.id);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `<:Tick:1035765324693385226> Successfully set **${voice.name}** as the default voice for ${message.author.username}!`
            ),
        ],
      });
    }
  },
};

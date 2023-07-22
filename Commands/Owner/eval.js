const Discord = require("discord.js");
const { inspect } = require("util");
const { EmbedBuilder } = require("discord.js");
const sourcebin = require("sourcebin_js");
module.exports = {
  name: "eval",
  aliases: ["ev", "e"],
  description: "Evaluates a Command",
  args: true,
  usage: "<code>",
  ownerOnly: true,
  category: "dev",
  async execute(message, args, client) {
    const code = args.join(" ");
    const now = Date.now();
    try {
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      if (evaled.length >= 2000) {
        sourcebin
          .create([
            {
              name: "Evaled Result",
              content: evaled,
              languageId: "js",
            },
          ])
          .then(async (src) => {
            await message.reply({
              content: `Your evaluated result was more than 2000 characters! Here is your result: ${src.url}`,
            });
          });
      } else {
        message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("📤 Output")
              .setDescription(`${clean(evaled)}`)
              .setColor(client.color)
              .setFooter({ text: `Time took: ${Date.now() - now}ms` }),
          ],
          allowedMentions: { repliedUser: false },
        });
      }
    } catch (error) {
      message.reply({
        content: `\`\`\`js\n${error}\n\`\`\``,
        ephemeral: true,
        allowedMentions: {
          repliedUser: false,
        },
      });
    }
  },
};

function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

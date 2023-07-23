const { EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
module.exports = {
  name: "disconnect",
  description: "Disconnect the bot from current vc.",
  aliases: [],
  args: false,
  usage: "",
  permissions: "ManageServer",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  category: "admin",
  async execute(message, args, client) {
    const queue = useQueue(message.guild.id);
    if (!queue)
      return message.reply({ content: "❌ | I am **not** in a voice channel" });
    await queue.delete();
    return await message.reply({
      content: ":white_check_mark: | I have **successfully disconnected** from the voice channel",
    });
  },
};

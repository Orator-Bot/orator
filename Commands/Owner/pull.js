const { Message, Client } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  name: "pull",
  description: "Pull code to root",
  aliases: [],
  args: false,
  usage: "",
  permissions: "",
  botPerms: "",
  ownerOnly: true,
  cooldown: 0,
  category: "",
  premium: false,
  voteOnly: false,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    exec("npm run pull", (error, stdout, stderr) => {
      if (error) return message.reply(`${error.message}`);

      client.logger(
        "Successfully pulled from Github using command.",
        "success"
      );

      message.channel.send(
        "Pulled. Please wait for 5 seconds more before reloading."
      );
    });
  },
};

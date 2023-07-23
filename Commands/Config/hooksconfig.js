const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "hooksconfig",
  description: "Configure the hooks panel of your server",
  aliases: ["hooksconf", "hooks-settings", "configure-hooks"],
  args: true,
  usage: "autoleave <on | off>",
  permissions: "Administrator",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  category: "config",
  async execute(message, args, client) {
    switch (args[0].toLowerCase()) {
      case "autoleave":
        {
          const action = args[1];
          if (!action)
            return message.reply(
              "Correct usage: `.hooksconfig autoleave <on | off>`"
            );

          if (action === "on") {
            client.hooksconfdb
              .prepare(
                "INSERT OR REPLACE INTO hooksconfig(guild, autoleave) VALUES(?,?)"
              )
              .run(message.guild.id, "on");
            message.channel.send(
              ":white_check_mark: Successfully set the **autoleave config** to **ON**."
            );
          } else if (action === "off") {
            client.hooksconfdb
              .prepare(
                "INSERT OR REPLACE INTO hooksconfig(guild, autoleave) VALUES(?,?)"
              )
              .run(message.guild.id, "off");
            message.channel.send(
              ":white_check_mark: Successfully set the **autoleave config** to **OFF**."
            );
          } else {
            return message.reply(
              "Correct usage: `.hooksconfig autoleave <on | off>`"
            );
          }
        }
        break;
      default: {
        return message.reply("Available configurations: `autoleave`.");
      }
    }
  },
};

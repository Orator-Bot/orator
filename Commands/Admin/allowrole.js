const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "allowrole",
  description: "Allow roles to be able to use TTS commands.",
  aliases: [],
  args: true,
  usage: "<add | remove | list> <@role | roleid>",
  category: "admin",
  permissions: "Administrator",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  async execute(message, args, client) {
    const method = args[0]
    const db = client.allowroledb;
    switch (method) {
      case "add":
        {
          const role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[1]);
          if (!role) return message.reply("Please mention a valid role.");
          const existingWhitelist = db
            .prepare("SELECT * FROM allowrole WHERE guild_id = ?")
            .get(message.guild.id);
          if (existingWhitelist) {
            const newRoles = existingWhitelist.roles
              .split(",")
              .filter((role) => role !== role.id);
            newRoles.push(role.id);
            db.prepare("UPDATE allowrole SET roles = ? WHERE guild_id = ?").run(
              newRoles.join(","),
              message.guild.id
            );
            message.channel.send(
              `:white_check_mark: Added **${role.name}** to AllowRoles.`
            );
          } else {
            db.prepare(
              "INSERT INTO allowrole(guild_id, roles) VALUES(?,?)"
            ).run(message.guild.id, role.id);
            message.channel.send(
              `:white_check_mark: Added **${role.name}** to AllowRoles.`
            );
          }
        }
        break;
      case "remove":
        {
          const removeRole =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[1]);
          if (!removeRole) return message.reply("Invalid role provided.");
          const existingData = db
            .prepare("SELECT * FROM allowrole WHERE guild_id = ?")
            .get(message.guild.id);
          if (!existingData || !existingData.roles.includes(removeRole.id)) {
            return message.reply(
              `Role "${removeRole.name}" was not found in the database.`
            );
          } else {
            const newRemovedRoles = existingData.roles
              .split(",")
              .filter((role) => role !== removeRole.id);
            db.prepare("UPDATE allowrole SET roles = ? WHERE guild_id = ?").run(
              newRemovedRoles.join(","),
              message.guild.id
            );
            message.reply(
              `Role "**${removeRole.name}**" has been removed from the database.`
            );
          }
        }
        break;
      case "list":
        {
          const rolesList = db
            .prepare("SELECT roles FROM allowrole WHERE guild_id = ?")
            .get(message.guild.id);
          if (!rolesList || !rolesList.roles) {
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    "No roles are currently whitelisted for this guild."
                  )
                  .setColor(client.color),
              ],
            });
          } else {
            const allowedRoleIds = rolesList.roles.split(",");
            const allowedRoles = allowedRoleIds
              .map((roleId) => message.guild.roles.cache.get(roleId))
              .filter(Boolean);
            if (allowedRoles.length === 0) {
              return message.reply(
                "No valid whitelisted roles found for this guild."
              );
            }
            const roleList = allowedRoles
              .map(
                (role, index) => `${index + 1}. ${role.name} [ <@&${role.id}> ]`
              )
              .join("\n");
            const embed = new EmbedBuilder()
              .setTitle("AllowRole - Role List")
              .setDescription(roleList)
              .setColor(client.color)
              .setThumbnail(client.user.displayAvatarURL())
              .setFooter({ text: `${message.guild.name} - Allow Roles` })
              .setTimestamp();
            message.channel.send({
              embeds: [embed],
            });
          }
        }
        break;
      default: {
        return message.reply(
          "Invalid Usage! `.allowrole <add | remove | list>`."
        );
      }
    }
  },
};

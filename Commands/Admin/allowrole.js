const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "allowrole",
  description: "Allow roles to be able to use TTS commands.",
  aliases: [],
  args: true,
  usage: "<@role | roleid>",
  category: "admin",
  permissions: "Administrator",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  async execute(message, args, client){
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if(!role) return message.reply('Please mention a valid role.')
    const db = client.allowroledb
    const existingWhitelist = db.prepare("SELECT * FROM allowrole WHERE guild_id = ?").get(message.guild.id)
    if(existingWhitelist){
      const newRoles = existingWhitelist.roles.split(',').filter((role) => role !== role.id)
      newRoles.push(role.id)
      db.prepare("UPDATE allowrole SET roles = ? WHERE guild_id = ?").run(newRoles, message.guild.id)
      message.channel.send(`:white_check_mark: Added **${role.name}** to AllowRoles.`)
    }else{
      db.prepare('INSERT INTO allowrole(guild_id, roles) VALUES(?,?)').run(message.guild.id, role.id)
      message.channel.send(`:white_check_mark: Added **${role.name}** to AllowRoles.`)
    }
  }
};
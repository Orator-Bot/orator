const { EmbedBuilder } = require('discord.js')
const fetch = require('node-fetch')
module.exports = {
  name: "revoke",
  ownerOnly: true,
  description: "Revoke access of a premium guild",
  args: true,
  category: "dev",
  usage: "<guild id>",
  async execute(message, args, client) {
    let guildID = args[0];
    if (guildID.toLowerCase() === "this") guildID = message.guild.id;
    const endpointURL = `http://oratornodes.xyz:4000/dbdelete?serverId=${guildID}`
    const headers = {
      user: 'arijit',
      password: 'itsmemario',
    };

    const guildName = await client.guilds.fetch(guildID).then(async g => await g.name)
    const guildIcon = await client.guilds.fetch(guildID).then(async g => await g.iconURL())
    const prevembed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`Revoke Subscriptions: ${guildName}`)
      .setDescription(`<a:roti_loading:1105371517652578364> Revoking Datas...`)
      .setTimestamp()
      .setThumbnail(guildIcon)
    const msg = await message.channel.send({ embeds: [prevembed] })
    
    let description = ""
    client.premiumdb.prepare("DELETE FROM subscriptions WHERE guild_id = ?").run(guildID)
    description += `:white_check_mark: Revoked Subscription.\n`
    client.resetpanel.run(guildID)
    description += `:white_check_mark: Revoked Panel DB.\n`
    client.resetlogs.run(guildID)
    description += `:white_check_mark: Revoked Logs DB.\n`
    client.webhookdb.prepare('DELETE FROM webhookchannel WHERE guild_id = ?').run(guildID)
    description += `:white_check_mark: Revoked Webhook Channel DB.\n`
    client.webhookdb.prepare('DELETE FROM webhookvc WHERE guild_id = ?').run(guildID)
    description += `:white_check_mark: Revoked Webhook VC DB.\n`
    const blacklistRoleDB = new client.database('./Database/blacklistrole.db')
    blacklistRoleDB.prepare('DELETE FROM blacklistrole WHERE guild_id = ?').run(guildID)
    description += `:white_check_mark: Revoked Blacklist Role DB.\n`
    try {
      const response = await fetch(endpointURL, {
        method: 'POST',
        headers,
      });
      const data = await response.json();
      if(response.ok){
        description += `:white_check_mark: Data wiped from Payments API.\n`
      }else{
        description += `:cross: Couldn't wipe data from Payments API, Error: ${data}`
      }
    } catch (err) {
      console.log(err)
    }
    const nextembed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`Revoked Subscriptions: ${guildName}`)
      .setDescription(`${description}`)
      .setTimestamp()
      .setThumbnail(guildIcon)
    setTimeout(async () => {
      await msg.edit({
        embeds: [nextembed]
      })
    }, 5000)
  }
};
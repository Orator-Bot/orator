const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "config",
  description: "Check the configuration settings of this server.",
  aliases: ["settings", "conf"],
  args: false,
  usage: "",
  permissions: "",
  botPerms: "",
  ownerOnly: false,
  cooldown: 0,
  category: "config",
  async execute(message, args, client){
    const dot = "<:dot:1108430250003660831>"
    const embed = new EmbedBuilder()
      .setTitle(`Guild Settings - ${message.guild.name}`)
      .setThumbnail(message.guild.iconURL())
      .setColor(client.color)
      .setTimestamp()
    const prefixData = client.prefix.get(message.guild.id)
    if(prefixData){
      embed.addFields({
        name: `${dot} **Prefix:**`,
        value: `\`${prefixData.prefix}\`\n`
      })
    } else {
      embed.addFields({
        name: `${dot} **Prefix:**`,
        value: `\`.\``
      })
    }
    
    const panelData = client.getpanel.get(message.guild.id)
    if(panelData){
      embed.addFields({
        name: `${dot} **Panel:**`,
        value: `<#${panelData.channel}>`
      })
    }
    
    const oratorVCData = client.getoratorvc.get(message.guild.id)
    if(oratorVCData){
      embed.addFields({
        name: `${dot} **Orator VC:**`,
        value: `<#${oratorVCData.channel}>`
      })
    }
    
    const customTTSData = client.customlang.get(message.guild.id)
    if(customTTSData){
      const voice = customTTSData.sound;
      const voiceData = await client.fy.models.fetch(voice);
      embed.addFields({
        name: `${dot} **Custom Voice:**`,
        value: `${voiceData.title}`
      })
    }
    
    message.channel.send({
      embeds: [embed]
    })
  }
};
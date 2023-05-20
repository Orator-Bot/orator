const { EmbedBuilder, ChannelType } = require("discord.js")
module.exports = {
  name: "sethook",
  description: "Setup the webhook panel and vc",
  aliases: ["sh"],
  args: true,
  usage: "panel <channel> | vc <channel id>",
  permissions: "ManageGuild",
  botPerms: "",
  ownerOnly: false,
  category: "config",
  premium: true,
  cooldown: 0,
  async execute(message, args, client){
    const type = args[0]
    switch(type.toLowerCase()){
      case "panel": {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
        if(!channel) return message.reply('Please mention a valid channel.')
        if(channel.type !== ChannelType.GuildText) return message.reply("The channel must be a text channel.")
        const vcData = client.webhookdb.prepare('SELECT * FROM webhookvc WHERE guild_id = ?').get(message.guild.id)
        if(!vcData) return message.reply("You need to setup the voice channel first! Use: `.sethook vc channel-id`.")
        await channel.send({
          embeds: [ new EmbedBuilder()
          .setTitle("Hooks Panel")
          .setDescription(`Webhook messages panel.\nHook VC: <#${vcData.channel}>`)
          .setColor(client.color)
          ]
        })
        .then(() => {
          client.webhookdb.prepare("INSERT OR REPLACE INTO webhookchannel(guild_id, channel) VALUES(?,?)").run(message.guild.id, channel.id)
          message.reply(":white_check_mark: Successfully set the hook panel.")
        })
        .catch(() => message.reply("Error Occurred! Make sure I have permission to read and send message in " + channel + "."))
      }
      break;
      case "vc": {
        const channel = message.guild.channels.cache.get(args[1])
        if(!channel) return message.reply('Please mention a valid channel.')
        if(channel.type !== ChannelType.GuildVoice) return message.reply("The channel must be a voice channel.")
        client.webhookdb.prepare("INSERT OR REPLACE INTO webhookvc(guild_id, channel) VALUES(?,?)").run(message.guild.id, channel.id)
        message.reply(":white_check_mark: Successfully set the hooks vc.")
      }
      break;
      default: {
        message.reply("Invalid Method.")
      }
    }
  }
}
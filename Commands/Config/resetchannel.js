const { EmbedBuilder } = require("discord.js")
module.exports = {
  name: "resetchannel",
  description: "Reset the orator only channel.",
  args: false,
  usage: "",
  permissions: "ManageServer",
  botPerms: "",
  category: "config",
  ownerOnly: false,
  async execute(message, args, client){
    client.resetoratorvc.run(message.guild.id)
    message.reply('Orator channel was successfuy reset.')
  }
}
module.exports = {
  name: "resetlogs",
  description: "Reset the logs channel",
  permissions: "Administrator",
  category: "config",
  async execute(message, args, client){
    client.resetlogs.run(message.guild.id)
    await message.reply("Logs channel has been reset successfully.")
  }
}
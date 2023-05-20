module.exports = {
  name: "removeupdate",
  description: "Remove an update",
  ownerOnly: true,
  args: true,
  usage: "<ID>",
  category: "dev",
  async execute(message, args, client){
    const id = args[0]
    client.updatesdb.prepare("DELETE FROM updates WHERE id = ?").run(id)
    message.reply('Removed the update.')
  }
}
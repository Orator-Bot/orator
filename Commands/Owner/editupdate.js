module.exports = {
  name: "editupdate",
  description: "Edit an update.",
  args: true,
  usage: "<ID> <Update>",
  ownerOnly: true,
  category: "dev",
  async execute(message, args, client){
    const id = args[0]
    const msg = args.slice(1).join(" ")
    client.updatesdb.prepare("UPDATE updates SET message = ? WHERE id = ?").run(msg, id)
    message.reply('Edited the update.')
  }
}
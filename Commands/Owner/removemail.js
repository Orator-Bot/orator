module.exports = {
  name: "removemail",
  description: "Remove a mail",
  ownerOnly: true,
  args: true,
  usage: "<Mail ID>",
  category: "dev",
  async execute(message, args, client){
    const id = args[0]
    client.maildb.prepare("DELETE FROM mail WHERE AND id = ?").run(id)
    message.reply('Removed the mail.')
  }
}
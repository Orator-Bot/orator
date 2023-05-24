module.exports = {
  name: "editmail",
  description: "Edit a mail.",
  args: true,
  usage: "<Mail ID> <Mail>",
  ownerOnly: true,
  category: "dev",
  async execute(message, args, client){
    const id = args[0];
    const msg = args.slice(1).join(" ");
    client.maildb.prepare("UPDATE mail SET message = ? WHERE id = ?").run(msg, id);
    message.reply("Edited the mail.");
  }
};
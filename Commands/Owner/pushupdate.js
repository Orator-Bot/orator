module.exports = {
  name: "pushupdate",
  description: "Push an update.",
  args: true,
  usage: "<Update>",
  ownerOnly: true,
  category: "dev",
  async execute(message, args, client){
    const date = new Date().toLocaleString();
    const msg = args.join(" ");
    client.updatesdb.prepare("INSERT INTO updates(date, message) VALUES(?,?)").run(date, msg);
    message.reply("Pushed a new update.");
  }
};
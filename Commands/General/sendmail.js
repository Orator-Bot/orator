module.exports = {
  name: "sendmail",
  description: "Send a mail.",
  args: true,
  usage: "<User ID> <Mail>",
  ownerOnly: true,
  async execute(message, args, client){
    const date = new Date().toLocaleString();
    const msg = args.slice(1).join(" ");
    const user = args[0];
    client.maildb.prepare("INSERT INTO mail(user, date, message) VALUES(?, ?,?)").run(user, date, msg);
    message.reply("📩 Sent mail to user: \`" + user + "\`.");
    try{
      const fetchedUser = client.users.fetch(user);
      if(!fetchedUser) return message.reply("User not found.");
      client.users.send(user, {
        content: `📩 <@${user}> you have a new mail. Use \`.mail\` to check the mail.`
      });
    }catch(err){
      return message.reply(err.message);
    }
  }
};
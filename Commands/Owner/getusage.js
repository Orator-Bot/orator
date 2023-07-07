module.exports = {
  name: "getusage",
  description: "Get the total commands usage",
  usage: "[command name]",
  ownerOnly: true,
  category: "dev",
  async execute(message, args, client){
    if(!args.length){
      const getTotalCommandUsage = () => {
        return client.statsdb.prepare("SELECT SUM(usage) as total FROM statsdb").get().total || 0
      }
      message.channel.send({
        content: `**Total Usage:** \`${getTotalCommandUsage()} times\``
      })
    }else{
      const data = client.statsdb.prepare("SELECT * FROM statsdb WHERE command = ?").get(args[0])
      if(data){
      message.channel.send({
        content: `Command: **${args[0]}** was used \`${data.usage} times\``
      })
      }else{
        message.channel.send({
        content: `No such commands are available.`
      })
      }
    }
  }
}
module.exports = {
  name: "say",
  description: "Say messages",
  ownerOnly: true,
  category: "dev",
  args: true,
  usage: "<message>",
  async execute(message, args, client) {
    const content = args.join(" ")
    const sentMsg = await message.channel.send({
      content: `${content
      .replace("{", "<@")
      .replace("}", ">")
      }`
    })
    
    await setTimeout(async () => {
      await message.delete()
    }, 3000)
  }
}
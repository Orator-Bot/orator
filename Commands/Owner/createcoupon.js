const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch")
module.exports = {
  name: "createcoupon",
  description: "Create a coupon code for Payments Discount",
  aliases: [],
  args: true,
  usage: "<discount>",
  permissions: "",
  botPerms: "",
  ownerOnly: true,
  cooldown: 0,
  category: "dev",
  async execute(message, args, client){
    const discount = parseInt(args[0])
    const endpointURL = `http://oratornodes.xyz:4000/api/coupon/create?discount=${discount}`
    
    const headers = {
     user: "arijit",
     password: "itsmemario"
    }
    
    try {
      const response = await fetch(endpointURL, {
        method: "POST",
        headers
      })
      const data = await response.json()
      if(response.ok){
        message.channel.send({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`Coupon code created for ${discount}% discount: \`${data.code}\`.`)
            ]
        })
      }else{
        console.log(data)
        return message.reply(`Error: ${data.error}`)
      }
    } catch (err) {
      console.log(err)
      return message.reply(`Error: ${err}`)
    }
  }
};
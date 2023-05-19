const { EmbedBuilder, WebhookClient } = require("discord.js")
const { stripIndent } = require('common-tags')
const ms = require("ms")
module.exports = {
  name: "addpremium",
  description: "Add premium to a user",
  aliases: ["ap"],
  args: true,
  usage: "<guildid> <userid> <time>",
  permissions: "",
  botPerms: "",
  ownerOnly: true,
  cooldown: 0,
  async execute(message, args, client) {
    
    const webhook = new WebhookClient({
      url: 'https://discord.com/api/webhooks/1087969080872546414/qLE6wMRVKvPN6aMFc34fshAUslo3qEaJJ4ILACI68_k1oyN7GkOjFlX-hyEjZ-DW72Aa'
    })
    
    let guildId = args[0]
    if(!guildId){
      return message.reply('You need to specify a guild id too.')
    }
    if(guildId.toLowerCase() === "this"){
      guildId = message.guild.id
    }
    const time = args[2]
    if (!ms(time)) {
      return message.reply('Please specify a valid time.')
    }
    const expireTime = Date.now() + ms(time)
    
    let userId = message.author.id
    const member = message.mentions.members.first()
    if(member){
      userId = member.user.id
    }else{
      userId = args[1]
    }
    const subscription = client.premiumdb.prepare('SELECT * FROM subscriptions WHERE guild_id = ?').get(guildId)

    if (subscription) {
      const endTime = ms(subscription.expires - Date.now(), {long: true})
      return message.reply(`That guild (\`${guildId}\`) already has subscription which has ${endTime} remaining.`)
    } else {
      client.premiumdb.prepare('INSERT INTO subscriptions(guild_id, user_id, expires) VALUES(?,?,?)').run(guildId, userId, expireTime)
      
      message.channel.send({
        embeds: [new EmbedBuilder().setColor(client.color).setDescription(`:white_check_mark: Added Premium Subscription to Guild ID: \`${guildId}\` with Booster User ID: [${await client.users.fetch(userId).then(async(u) => await u.tag)}](https://discord.com/users/${userId}) for ${ms(ms(time), { long: true })}`).setThumbnail(await client.guilds.fetch(guildId).then(async(g) => await g.iconURL()))]
      })
      
      const PremiumClaimedEmbed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`Added Premium by ${message.author.tag}`)
      .setDescription(stripIndent`
      __Guild ID__: ${guildId}
      __Booster__: ${userId} (https://discord.com/users/${userId})
      __Expiry Time:__ ${ms(time, { long: true })}
      __Premium Given By__: [${message.author.tag}](https://discord.com/users/${message.author.id})
      `)
      .setTimestamp()
      
      await webhook.send({
        embeds: [PremiumClaimedEmbed]
      })
    }
  }
}
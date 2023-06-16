const { EmbedBuilder, WebhookClient } = require("discord.js");
const { stripIndent } = require("common-tags");
const fetch = require("node-fetch")
const ms = require("ms");
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
  category: "dev",
  async execute(message, args, client) {

    const webhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1087969080872546414/qLE6wMRVKvPN6aMFc34fshAUslo3qEaJJ4ILACI68_k1oyN7GkOjFlX-hyEjZ-DW72Aa"
    });

    let guildId = args[0];
    if (!guildId) {
      return message.reply("You need to specify a guild id too.");
    }
    if (guildId.toLowerCase() === "this") {
      guildId = message.guild.id;
    }
    const time = args[2];
    if (!ms(time)) {
      return message.reply("Please specify a valid time.");
    }

    const endpointURL = `http://oratornodes.xyz:4000/dbcreate?serverId=${guildId}&time=${ms(time)}`

    const headers = {
      user: 'arijit',
      password: 'itsmemario',
    };

    const expireTime = Date.now() + ms(time);

    let userId = message.author.id;
    const member = message.mentions.members.first();
    if (member) {
      userId = member.user.id;
    } else {
      userId = args[1];
    }
    const subscription = client.premiumdb.prepare("SELECT * FROM subscriptions WHERE guild_id = ?").get(guildId);

    if (subscription) {
      const endTime = ms(subscription.expires - Date.now(), { long: true });
      return message.reply(`That guild (\`${guildId}\`) already has subscription which has ${endTime} remaining.`);
    } else {
      client.premiumdb.prepare("INSERT INTO subscriptions(guild_id, user_id, expires) VALUES(?,?,?)").run(guildId, userId, expireTime);
      let description = `:white_check_mark: Added Premium Subscription to Guild ID: \`${guildId}\` with Booster User ID: [${await client.users.fetch(userId).then(async(u) => await u.tag)}](https://discord.com/users/${userId}) for ${ms(ms(time), { long: true })}\n`
      try {
        const response = await fetch(endpointURL, {
          method: 'POST',
          headers,
        });
        const data = await response.json();
        if (response.ok) {
          description += `:white_check_mark: Payment API: Done.\n`
        } else {
          description += `❌ Payment API: Error- ${data}`
        }
      } catch (err) {
        console.log(err)
      }
      message.channel.send({
        embeds: [new EmbedBuilder().setColor(client.color).setDescription(description).setThumbnail(await client.guilds.fetch(guildId).then(async (g) => await g.iconURL()))]
      });

      const guildName = await client.guilds.fetch(guildId).then(async g => await g.name)
      const guildIcon = await client.guilds.fetch(guildId).then(async g => await g.iconURL())
      const boosterTag = await client.users.fetch(userId).then(async u => await u.tag)
      const PremiumClaimedEmbed = new EmbedBuilder()
        .setTitle(`Premium Activated in: ${guildName}`)
        .setThumbnail(guildIcon)
        .setDescription(`Premium Bot: ` + client.user.username)
        .addFields({
          name: '__Guild ID__',
          value: `${guildId}`
        }, {
          name: '__Booster__',
          value: `${boosterTag}`
        }, {
          name: '__Expiry Time__',
          value: `${time}`
        })
        .setFooter({
          text: `Premium added by: ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL()
        })
        .setColor(client.color)

      await webhook.send({
        embeds: [PremiumClaimedEmbed]
      });
    }
  }
};
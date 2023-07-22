const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "testrevoke",
  description: "Revoke access of a premium guild",
  args: true,
  category: "dev",
  usage: "<guild id | this>",
  async execute(message, args, client) {
    if (
      ![
        "842620032960823327",
        "883280307636289567",
        "712601857473773611",
      ].includes(message.author.id)
    )
      return;

    let guildID = args[0];
    if (guildID.toLowerCase() === "this") guildID = message.guild.id;

    const guildData = await client.guilds.fetch(guildID);
    if (!guildData) return message.reply("Invalid Guild ID.");

    const guildName = await client.guilds
      .fetch(guildID)
      .then(async (g) => await g.name);
    const dbCheck = client.premiumdb
      .prepare("SELECT * FROM subscriptions WHERE guild_id = ? AND user_id = ?")
      .get(guildID, message.author.id);
    if (!dbCheck)
      return message.reply(
        `You're not the booster of the guild: \`${guildName}\``
      );
    const guildIcon = await client.guilds
      .fetch(guildID)
      .then(async (g) => await g.iconURL());
    const prevembed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`Revoke Subscriptions: ${guildName}`)
      .setDescription(`<a:roti_loading:1105371517652578364> Revoking Datas...`)
      .setTimestamp()
      .setThumbnail(guildIcon);

    const msg = await message.channel.send({ embeds: [prevembed] });

    let description = "";
    client.premiumdb
      .prepare("DELETE FROM subscriptions WHERE guild_id = ? AND user_id = ?")
      .run(guildID, message.author.id);

    description += `:white_check_mark: Revoked Subscription.\n`;
    client.resetpanel.run(guildID);
    description += `:white_check_mark: Revoked Panel DB.\n`;
    client.resetlogs.run(guildID);
    description += `:white_check_mark: Revoked Logs DB.\n`;
    client.webhookdb
      .prepare("DELETE FROM webhookchannel WHERE guild_id = ?")
      .run(guildID);
    description += `:white_check_mark: Revoked Webhook Channel DB.\n`;
    client.webhookdb
      .prepare("DELETE FROM webhookvc WHERE guild_id = ?")
      .run(guildID);
    description += `:white_check_mark: Revoked Webhook VC DB.\n`;
    const blacklistRoleDB = new client.database("./Database/blacklistrole.db");
    blacklistRoleDB
      .prepare("DELETE FROM blacklistrole WHERE guild_id = ?")
      .run(guildID);
    description += `:white_check_mark: Revoked Blacklist Role DB.\n`;

    const nextembed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`Revoked Subscriptions: ${guildName}`)
      .setDescription(`${description}`)
      .setTimestamp()
      .setThumbnail(guildIcon);
    setTimeout(async () => {
      await msg.edit({
        embeds: [nextembed],
      });
    }, 5000);
  },
};

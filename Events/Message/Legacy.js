const {
  EmbedBuilder,
  Collection,
  ChannelType,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  WebhookClient,
} = require("discord.js");
const fetch = require("node-fetch");
const { stripIndent } = require("common-tags");
const ms = require("ms");
const colors = require("colors");
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
module.exports = {
  name: "messageCreate",
  async execute(message) {
    const webhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1126901001501294692/dp1OEYSD74NNU7Mu5-X4ULOxtR68gfcluasCOHG2Jz39Q-Mm2PyIDa9HWRx4i9iGBZnZ",
    });
    const { client, guild, channel, content, author } = message;

    const getPremiumBtn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Upgrade to Premium")
        .setEmoji("<a:__:1063829203117686895>")
        .setURL("https://discord.gg/TeS3haQ4tT")
        .setStyle(ButtonStyle.Link)
    );
    if (message.content === `<@${message.client.user.id}>`) {
      if (client.config.owners.includes(message.author.id)) {
        if (client.prefix.get(message.guild.id)) {
          message.reply(
            "Yes papa" +
              ` mera prefix hai ${client.prefix.get(message.guild.id).prefix}`
          );
        } else {
          message.reply("Yes papa" + " mera prefix hai `.`");
        }
      } else {
        if (client.prefix.get(message.guild.id)) {
          message.reply(
            `The prefix of ${message.client.user.username} in this server is ${
              client.prefix.get(message.guild.id).prefix
            }`
          );
        } else {
          message.reply(
            `The prefix of ${message.client.user.username} in this server is ${client.config.Prefix}`
          );
        }
      }
    }

    let prefix = client.config.Prefix;
    if (client.prefix.get(message.guild.id)) {
      prefix = client.prefix.get(message.guild.id).prefix;
    }
    const checkPrefix = prefix.toLowerCase();
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(checkPrefix)}|o|o )\\s*`
    );
    if (!prefixRegex.test(content.toLowerCase())) return;
    const [matchedPrefix] = content.toLowerCase().match(prefixRegex);
    const args = content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (!message.content.startsWith(matchedPrefix) || message.author.bot)
      return;
    const command =
      client.legacy.get(commandName) ||
      client.legacy.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );
    if (!command) return;
    if (!command.description)
      return client.logger(
        `You need to pass a description in ${command.name}`,
        "warn"
      );
    if (command) {
      if (!client.config.owners.includes(message.author.id)) {
        const banData = client.getbanneduser.get(message.author.id);
        if (banData) {
          return message.reply(
            "Sorry we can't process your request!\n**Reason:** You're blacklisted from using the bot. If you think its a mistake, then create a ticket in our support server."
          );
        }
      }
      const incrementCommandCount = (cmdName) => {
        client.statsdb
          .prepare(
            "INSERT INTO statsdb(command, usage) VALUES(?, 1) ON CONFLICT(command) DO UPDATE SET usage = usage + 1"
          )
          .run(cmdName);
      };
      const getTotalCommandUsage = () => {
        return (
          client.statsdb
            .prepare("SELECT SUM(usage) as total FROM statsdb")
            .get().total || 0
        );
      };
      incrementCommandCount(`${command.name}`);
      const totalUsage = getTotalCommandUsage();
      await webhook.send({
        content: `→ [${totalUsage}] **${message.author.username} used:** ${command.name}\nUser: ${message.author.id}\nGuild: ${message.guild.id}`,
      });
    }
    if (command.guildOnly && message.channel.type === ChannelType.DM) {
      return message.reply({
        content: "I can't execute that command inside DMs!",
      });
    }
    if (command.stop) {
      return message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(":x: This Command is Under Maintenance!"),
          ],
        })
        .catch((err) => {});
    }
    if (command.ownerOnly) {
      if (!client.config.owners.includes(message.author.id)) return;
    }
    if (command.beta) {
      const betaData = client.betadb
        .prepare("SELECT * FROM beta WHERE guild_id = ?")
        .get(message.guild.id);
      if (!betaData) return;
    }
    if (command.premium) {
      const data = client.premiumdb
        .prepare("SELECT * FROM subscriptions WHERE guild_id = ?")
        .get(message.guild.id);
      if (!data) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("You discovered a Premium Command")
              .setDescription(
                `${command.name} is a Premium only command. ${message.guild.name} doesn't have any Premium Subscriptions, Click on the button below to get Premium.`
              )
              .setColor(client.color),
          ],
          components: [getPremiumBtn],
        });
      }
    }
    if (command.voteOnly) {
      const premiumData = client.premiumdb
        .prepare("SELECT * FROM subscriptions WHERE guild_id = ?")
        .get(message.guild.id);
      if (!premiumData) {
        const url = `https://top.gg/api/bots/${client.user.id}/check?userId=${message.author.id}`;
        fetch(url, {
          method: "GET",
          headers: {
            Authorization: `${client.config.TOPGGTOKEN}`,
          },
        })
          .then((res) => res.text())
          .then((json) => {
            const voteRes = JSON.parse(json).voted;
            if (voteRes === 0) {
              message.channel.send(
                "You haven't voted yet! Please use `" +
                  prefix +
                  "vote` to vote the bot."
              );
              return;
            }
          });
      }
    }
    if (command.cooldown) {
      const now = Date.now();
      const cooldownAmount = command.cooldown;
      const cooldown = client.cooldown.get(command.name, message.author.id);
      if (cooldown && cooldown.timestamp + cooldownAmount > now) {
        const timeLeft = cooldown.timestamp + cooldownAmount - now;
        return message.reply(
          `You're on a cooldown. Please wait ${ms(Math.floor(timeLeft), {
            long: true,
          })} before reusing the \`${command.name}\` command.`
        );
      } else {
        client.setcooldown.run(command.name, message.author.id, now);
      }
    }
    if (command.botPerms) {
      if (!message.guild.members.me.permissions.has(command.botPerms || [])) {
        let noBotPerms = new EmbedBuilder()
          .setDescription(
            `:x: | I Don't have ${command.botPerms} Permission To Use The Command!`
          )
          .setColor(client.color);
        return message.channel
          .send({
            embeds: [noBotPerms],
          })
          .catch((err) => {});
      }
    }
    if (command.permissions) {
      if (!message.member.permissions.has(command.permissions || [])) {
        let noPerms = new EmbedBuilder()
          .setDescription(
            `:x: | You Don't Have ${command.permissions} Permission To Use The Command!`
          )
          .setColor(client.color);
        return message.reply({ embeds: [noPerms] }).catch((err) => {});
      }
    }
    if (command.args && !args.length) {
      const ArgsEmbed = new EmbedBuilder()
        .setTitle("You didn't provide any arguments!")
        .setColor(client.color)
        .setDescription(
          stripIndent`
          \`\`\`diff
        - [] = optional argument
        - <> = required argument
        - Do NOT type these when using commands!
          \`\`\`
          > ${command.description}
          `
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp();
      if (command.usage) {
        ArgsEmbed.addFields({
          name: "Correct Usage:",
          value: `\`\`\`\n${prefix}${command.name} ${command.usage}\n\`\`\``,
        });
      }
      return message.channel.send({ embeds: [ArgsEmbed] });
    }
    try {
      command.execute(message, args, client);
    } catch (error) {
      client.logger(error, "warn");
      message.reply({
        content: "There was an error trying to execute that command!",
      });
    }
  },
};

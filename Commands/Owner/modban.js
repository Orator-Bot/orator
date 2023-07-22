const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
module.exports = {
  name: "modban",
  description: "Bans a user from using the bot",
  aliases: [],
  args: true,
  usage: "<userID | @user>",
  permissions: "",
  botPerms: "",
  ownerOnly: true,
  cooldown: 0,
  category: "dev",
  async execute(message, args, client) {
    let userId = args[0];
    const mentionedMember = message.mentions.members.first();

    const yesButton = new ButtonBuilder()
      .setLabel("Yes")
      .setCustomId("yes-ban")
      .setStyle(ButtonStyle.Success);

    const noButton = new ButtonBuilder()
      .setLabel("No")
      .setCustomId("no-ban")
      .setStyle(ButtonStyle.Danger);

    const buttons = new ActionRowBuilder().addComponents(yesButton, noButton);

    if (mentionedMember) {
      userId = mentionedMember.user.id;
      const mentionedEmbed = new EmbedBuilder()
        .setAuthor({
          name: mentionedMember.user.username,
          iconURL: mentionedMember.user.displayAvatarURL(),
        })
        .setColor(client.color)
        .setDescription(
          `> Are you sure to ban **${mentionedMember.user.username}** from using Orator?`
        )
        .setTimestamp();
      const mentionedMsg = await message.channel.send({
        embeds: [mentionedEmbed],
        components: [buttons],
      });
      const mentionedCollector =
        await mentionedMsg.createMessageComponentCollector({
          filter: (i) => i.user.id === message.author.id,
          idle: 60000,
        });

      mentionedCollector.on("collect", async (interaction) => {
        switch (interaction.customId) {
          case "yes-ban":
            {
              client.banuser.run(mentionedMember.user.id);
              await interaction.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(
                      ":white_check_mark: Successfully banned **" +
                        mentionedMember.user.username +
                        "** from using Orator."
                    ),
                ],
                components: [],
              });
            }
            break;
          case "no-ban":
            {
              await interaction.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("Cancelled."),
                ],
                components: [],
              });
            }
            break;
          default: {
            interaction.reply("Invalid Custom ID.");
          }
        }
      });
    } else {
      await client.users.fetch(args[0]).then(async (member) => {
        const noMentionEmbed = new EmbedBuilder()
          .setAuthor({
            name: member.username,
            iconURL: member.displayAvatarURL(),
          })
          .setColor(client.color)
          .setDescription(
            `> Are you sure to ban **${member.username}** from using Orator?`
          )
          .setTimestamp();
        const noMentionMsg = await message.channel.send({
          embeds: [noMentionEmbed],
          components: [buttons],
        });
        const noMentionCollector =
          await noMentionMsg.createMessageComponentCollector({
            filter: (i) => i.user.id === message.author.id,
            idle: 60000,
          });

        noMentionCollector.on("collect", async (interaction) => {
          switch (interaction.customId) {
            case "yes-ban":
              {
                client.banuser.run(member.id);
                await interaction.update({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Green")
                      .setDescription(
                        ":white_check_mark: Successfully banned **" +
                          member.username +
                          "** from using Orator."
                      ),
                  ],
                  components: [],
                });
              }
              break;
            case "no-ban":
              {
                await interaction.update({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Red")
                      .setDescription("Cancelled."),
                  ],
                  components: [],
                });
              }
              break;
            default: {
              interaction.reply("Invalid Custom ID.");
            }
          }
        });
      });
    }
  },
};

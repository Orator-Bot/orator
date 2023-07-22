const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const { stripIndent } = require("common-tags");
module.exports = {
  name: "setcustomvoice",
  aliases: ["customvoice", "cv"],
  description: "Set the custom voice",
  permissions: "Administrator",
  premium: true,
  category: "config",
  async execute(message, args, client) {
    let voice = "TM:7wbtjphx8h8v";
    const cVoice = client.customlang.get(message.guild.id);
    if (cVoice) voice = cVoice.sound;
    const voiceData = await client.fy.models.fetch(voice);
    const Embed = new EmbedBuilder()
      .setTitle("Custom Voice List")
      .setDescription(
        stripIndent`
      🔊 Current Voice: ${voiceData.title}
      
     Select one voice from the select menu below. They are currently available voices, more voices coming very soon.
    `
      )
      .setColor("#486FFA")
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      });

    const selectMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setPlaceholder("Select a voice")
        .setCustomId("custom-voice-menu")
        .addOptions(
          {
            label: "Sicilian Electrician",
            value: "TM:7wbtjphx8h8v",
          },
          {
            label: "Donald Trump (US President)",
            value: "TM:aejrk66wq3ss",
          },
          {
            label: "Donald Trump (Angry)",
            value: "TM:4v0ft4j72y2g",
          },
          {
            label: "Luigi (Super Mario)",
            value: "TM:eq4cxqfnjc2y",
          },
          {
            label: "Mario (Super Mario)",
            value: "TM:c7j599fz0pbg",
          },
          {
            label: "Tony Stark (Ironman)",
            value: "TM:cp6vg8m1n4qq",
          },
          {
            label: "MrBeast",
            value: "TM:m20pfzak370d",
          },
          {
            label: "Elon Musk",
            value: "TM:fxq6hnfc3rht",
          },
          {
            label: "Naruto Uzumaki",
            value: "TM:yn4n7kwj9404",
          },
          {
            label: "Cristiano Ronaldo",
            value: "TM:z7kyfj6yrnnk",
          },
          {
            label: "Leonel Messi",
            value: "TM:mnvzyw98sx5t",
          },
          {
            label: "Joe Biden",
            value: "TM:wsvak9gwrdqf",
          },
          {
            label: "Hulk",
            value: "TM:v0rhad5mddmn",
          },
          {
            label: "Spider Man",
            value: "TM:c6dwjmqtg5jp",
          },
          {
            label: "Scooby-Doo",
            value: "TM:3fcxdr8nyvgm",
          },
          {
            label: "Andrew Tate",
            value: "TM:43c7p13p3z5c",
          },
          {
            label: "Wednesday Adams",
            value: "TM:pqv7261xqhjk",
          },
          {
            label: "Morgan Freeman",
            value: "TM:709ck7g83431",
          },
          {
            label: "Arthur C. Clarke",
            value: "TM:bysebgf36tkg",
          },
          {
            label: "Stone Cold",
            value: "TM:zd1vsgfvt9rc",
          }
        )
    );

    const sentEmbed = await message.channel.send({
      embeds: [Embed],
      components: [selectMenu],
    });

    const collector = await sentEmbed.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 30000,
      componentType: ComponentType.SelectMenu,
    });

    collector.on("collect", async (interaction) => {
      if (!interaction.isStringSelectMenu()) return;
      const selectedVoice = interaction.values[0];
      client.setcustomlang.run(interaction.guild.id, selectedVoice);
      await interaction.deferUpdate();
      await sentEmbed.edit({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              "<:Tick:1035765324693385226>" + " Successfully Saved New Voice"
            )
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            }),
        ],
        components: [],
      });
    });
  },
};

const {
  EmbedBuilder,
  ActionRowBuilder,
  ComponentType,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const { stripIndent } = require("common-tags")
module.exports = {
  name: "setlanguage",
  description: "Get the list of all languages available.",
  aliases: ["setlang"],
  permissions: "Administrator",
  category: "config",
  async execute(message, args, client) {
    const selectLang = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
        .setPlaceholder("Select a Language (A-F)")
        .setCustomId("select-lang")
        .addOptions(
        {
          label: "Afrikaans",
          value: "af"
        },
        {
          label: "Albanian",
          value: "sq"
        },
        {
          label: "Arabic",
          value: "ar"
        },
        {
          label: "Armenian",
          value: "hy"
        },
        {
          label: "Catalan",
          value: "ca"
        },
        {
          label: "Chinese",
          value: "zh"
        },
        {
          label: "Chinese (Mandarin/China)",
          value: "zh-ch"
        },
        {
          label: "Chinese (Mandarin/Taiwan)",
          value: "zh-tw"
        },
        {
          label: "Chinese (Cantonese)",
          value: "zh-yue"
        },
        {
          label: "Croatian",
          value: "hr"
        },
        {
          label: "Czech",
          value: "cs"
        },
        {
          label: "Danish",
          value: "da"
        },
        {
          label: "Dutch",
          value: "nl"
        },
        {
          label: "English",
          value: "en"
        }, {
          label: "English (Australia)",
          value: "en-au"
        }, {
          label: "English (United Kingdom)",
          value: "en-uk"
        }, {
          label: "English (United States)",
          value: "en-us"
        }, {
          label: "Esperanto",
          value: "eo"
        }, {
          label: "Finnish",
          value: "fi"
        }, {
          label: "French",
          value: "fr"
        }))
    const selectLang2 = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
        .setPlaceholder("Select a Langauge (G-M)")
        .setCustomId("select-langauge-2")
        .addOptions(
        {
          label: "German",
          value: "de"
        }, {
          label: "Greek",
          value: "el"
        }, {
          label: "Haitian Creole",
          value: "ht"
        }, {
          label: "Hindi",
          value: "hi"
        }, {
          label: "Hungarian",
          value: "hu"
        },
        {
          label: "Icelandic",
          value: "is"
        }, {
          label: "Indonesian",
          value: "id"
        }, {
          label: "Italian",
          value: "it"
        },
        {
          label: "Japanese",
          value: "ja"
        },
        {
          label: 'Korean',
          value: 'ko'
        }, {
          label: 'Latin',
          value: 'la'
        }, {
          label: 'Latvian',
          value: 'lv'
        },
        {
          label: "Macedonian",
          value: "mk"
        })
      )
    const selectLang3 = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
        .setPlaceholder("Select a language (N-Z)")
        .setCustomId("select-language-3")
        .addOptions({
          label: "Norwegian",
          value: "no"
        }, {
          label: "Polish",
          value: "pl"
        }, {
          label: "Portuguese",
          value: "pt"
        }, {
          label: "Portuguese (Brazil)",
          value: "pt-br"
        }, {
          label: "Romanian",
          value: "ro"
        }, {
          label: 'Russian',
          value: 'ru'
        }, {
          label: 'Serbain',
          value: 'sr'
        }, {
          label: 'Slovak',
          value: 'sk'
        }, {
          label: 'Spanish',
          value: 'es'
        }, {
          label: 'Spanish (Spain)',
          value: 'es-es'
        }, {
          label: 'Spanish (United States)',
          value: 'es-us'
        }, {
          label: 'Swahili',
          value: 'sw'
        }, {
          label: 'Swedish',
          value: 'sv'
        }, {
          label: 'Tamil',
          value: 'ta'
        }, {
          label: 'Thai',
          value: 'th'
        }, {
          label: 'Turkish',
          value: 'tr'
        }, {
          label: 'Vietnamese',
          value: 'vi'
        }, {
          label: 'Welsh',
          value: 'cy'
        })
      )
    let getLangOutput;
    const hasCustomLang = client.getlang.get(message.guild.id)
    if (!hasCustomLang) getlangOutput = "en"
    else getlangOutput = hasCustomLang.language
    const sentEmbed = await message.channel.send({
      embeds: [new EmbedBuilder()
      .setColor("#486FFA")
      .setDescription(`Select a language to set it as default language of the Bot.\nCurrent Language: ${getlangOutput}`)
      .setTitle("Set Language")
      .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL()
        })
      ],
      components: [selectLang, selectLang2, selectLang3]
    })

    const collector = await sentEmbed.createMessageComponentCollector({
      filter: i => i.user.id === message.author.id,
      time: 30000,
      componentType: ComponentType.SelectMenu
    })

    collector.on('collect', async interaction => {
      if (!interaction.isStringSelectMenu()) return;
      const selectedLanguage = interaction.values[0]
      await interaction.deferUpdate()
      client.setlang.run(interaction.guild.id, selectedLanguage)
      await sentEmbed.edit({
        embeds: [
          new EmbedBuilder()
          .setColor(client.color)
          .setTitle("Saved Settings.")
          .setDescription(`<:Tick:1083311747710078976> Successfully Set Language to ${selectedLanguage}`)
          .setFooter({
            text: "Requested by " + interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL()
          })
          ],
        components: []
      })
    })
  }
}
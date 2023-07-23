const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (
      !["panel-change-language", "panel-config", "panel-change-voice"].includes(
        interaction.customId
      )
    )
      return;
    if (!interaction.member.permissions.has("Administrator"))
      return interaction.reply({
        content: "You need Administrator permission to use the Buttons.",
        ephemeral: true,
      });
    if (interaction.customId === "panel-change-language") {
      const menu1 = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setPlaceholder("Select a Language (A-F)")
          .setCustomId("select-lang")
          .addOptions(
            {
              label: "Afrikaans",
              value: "af",
            },
            {
              label: "Albanian",
              value: "sq",
            },
            {
              label: "Arabic",
              value: "ar",
            },
            {
              label: "Armenian",
              value: "hy",
            },
            {
              label: "Catalan",
              value: "ca",
            },
            {
              label: "Chinese",
              value: "zh",
            },
            {
              label: "Chinese (Mandarin/China)",
              value: "zh-ch",
            },
            {
              label: "Chinese (Mandarin/Taiwan)",
              value: "zh-tw",
            },
            {
              label: "Chinese (Cantonese)",
              value: "zh-yue",
            },
            {
              label: "Croatian",
              value: "hr",
            },
            {
              label: "Czech",
              value: "cs",
            },
            {
              label: "Danish",
              value: "da",
            },
            {
              label: "Dutch",
              value: "nl",
            },
            {
              label: "English",
              value: "en",
            },
            {
              label: "English (Australia)",
              value: "en-au",
            },
            {
              label: "English (United Kingdom)",
              value: "en-uk",
            },
            {
              label: "English (United States)",
              value: "en-us",
            },
            {
              label: "Esperanto",
              value: "eo",
            },
            {
              label: "Finnish",
              value: "fi",
            },
            {
              label: "French",
              value: "fr",
            }
          )
      );

      const menu2 = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setPlaceholder("Select a Langauge (G-M)")
          .setCustomId("select-lang-2")
          .addOptions(
            {
              label: "German",
              value: "de",
            },
            {
              label: "Greek",
              value: "el",
            },
            {
              label: "Haitian Creole",
              value: "ht",
            },
            {
              label: "Hindi",
              value: "hi",
            },
            {
              label: "Hungarian",
              value: "hu",
            },
            {
              label: "Icelandic",
              value: "is",
            },
            {
              label: "Indonesian",
              value: "id",
            },
            {
              label: "Italian",
              value: "it",
            },
            {
              label: "Japanese",
              value: "ja",
            },
            {
              label: "Korean",
              value: "ko",
            },
            {
              label: "Latin",
              value: "la",
            },
            {
              label: "Latvian",
              value: "lv",
            },
            {
              label: "Macedonian",
              value: "mk",
            }
          )
      );

      const menu3 = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setPlaceholder("Select a language (N-Z)")
          .setCustomId("select-lang-3")
          .addOptions(
            {
              label: "Norwegian",
              value: "no",
            },
            {
              label: "Polish",
              value: "pl",
            },
            {
              label: "Portuguese",
              value: "pt",
            },
            {
              label: "Portuguese (Brazil)",
              value: "pt-br",
            },
            {
              label: "Romanian",
              value: "ro",
            },
            {
              label: "Russian",
              value: "ru",
            },
            {
              label: "Serbain",
              value: "sr",
            },
            {
              label: "Slovak",
              value: "sk",
            },
            {
              label: "Spanish",
              value: "es",
            },
            {
              label: "Spanish (Spain)",
              value: "es-es",
            },
            {
              label: "Spanish (United States)",
              value: "es-us",
            },
            {
              label: "Swahili",
              value: "sw",
            },
            {
              label: "Swedish",
              value: "sv",
            },
            {
              label: "Tamil",
              value: "ta",
            },
            {
              label: "Thai",
              value: "th",
            },
            {
              label: "Turkish",
              value: "tr",
            },
            {
              label: "Vietnamese",
              value: "vi",
            },
            {
              label: "Welsh",
              value: "cy",
            }
          )
      );

      let currentVoice = "en";
      const voiceData = client.getlang.get(interaction.guild.id);
      if (voiceData) currentVoice = voiceData.lang;
      await interaction.reply({
        content: "Change Language Embed Here",
        embeds: [
          new EmbedBuilder()
            .setTitle("Select a voice language.")
            .setDescription("Current Voice: " + currentVoice)
            .setTimestamp()
            .setColor(client.color),
        ],
        components: [menu1, menu2, menu3],
        ephemeral: true,
      });
    } else if (interaction.customId === "panel-config") {
      const ConfigEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle("Panel Configuration")
        .setDescription(
          "🗣️ Speaker Info: Enable or Disable Speaker Info.\n⏯️ Pause/Unpause: Pause or Resume the panel to work."
        )
        .setTimestamp();

      const ConfigButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Enable/Disable Speaker Info")
          .setCustomId("conf-spinfo")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("🗣️"),

        new ButtonBuilder()
          .setLabel("Pause / Unpause Panel")
          .setCustomId("conf-pause-unpause")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("⏯️")
      );
      await interaction.reply({
        embeds: [ConfigEmbed],
        components: [ConfigButtons],
        ephemeral: true,
      });
    } else {
      const panelAPI = client.panelapi
        .prepare("SELECT * FROM panelapi WHERE guild = ?")
        .get(interaction.guild.id);
      if (!panelAPI) {
        return interaction.reply({
          content:
            "You can't change the voice because your current selected API is: `Google TTs API`.",
          ephemeral: true,
        });
      } else {
        switch (panelAPI.api) {
          case "google":
            {
              return interaction.reply({
                content:
                  "You can't change the voice because your current selected API is: `Google TTs API`.",
                ephemeral: true,
              });
            }
            break;
          case "unreal":
            {
              const maleVoiceButton = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("panel-event-unreal")
                  .setPlaceholder("Set a Male voice")
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setOptions([
                    {
                      label: "Male 1",
                      value: "male-0",
                    },
                    {
                      label: "Male 2",
                      value: "male-1",
                    },
                    {
                      label: "Male 3",
                      value: "male-2",
                    },
                    {
                      label: "Male 4",
                      value: "male-3",
                    },
                  ])
              );
              await interaction.reply({
                content: "Setup a custom Male Voice using the button below:",
                components: [maleVoiceButton],
                ephemeral: true,
              });
            }
            break;
          case "fakeyou": {
            return interaction.reply({
              content:
                "To set the custom voice for Fakeyou API, you need to use `.setvoice`",
              ephemeral: true,
            });
          }
        }
      }
    }
  },
};

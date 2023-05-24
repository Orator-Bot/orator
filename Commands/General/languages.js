const {
  EmbedBuilder
} = require("discord.js");
const { stripIndent } = require("common-tags");
const { Pagination } = require("pagination.djs");
module.exports = {
    name: "languages",
    description: "Get the list of available languages",
    category: "general",
    async execute(message, args, client) {
      const pagination = new Pagination(message, {
        firstEmoji: "<:ff:1040299724936323156>",
        prevEmoji: "<:leftarrow:1040299945497993287>",
        nextEmoji: "<:rightarrow:1040299958760374356>",
        lastEmoji: "<:ff2:1040299740245524480>",
        limit: 1,
        idle: 30000
      });

      const embed1 = new EmbedBuilder()
        .setAuthor({ name: "Languages", iconURL: client.user.displayAvatarURL() })
        .setColor(client.color)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(stripIndent`
      **__English__**
      en: English
      en-US: English (US)
      en-GB: English (UK)
      en-IN: English (India)
      en-AU: English (Australia)
      `);
      const embed2 = new EmbedBuilder()
        .setAuthor({ name: "Languages", iconURL: client.user.displayAvatarURL() })
        .setColor("Blurple")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(stripIndent`
      **__A-D__**
      af: African
      ar: Arabic
      bn: Bengali
      bg: Belgarian
      ca: Catalan
      cmn: Chinese
      cs: Czech
      da: Danish
      nl: Dutch
      `);
      const embed3 = new EmbedBuilder()
        .setAuthor({ name: "Languages", iconURL: client.user.displayAvatarURL() })
        .setColor("Blurple")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(stripIndent`
      **__E-H__**
      fil: Filipino
      fr: French
      de: German
      el: Greek
      gu: Gujarati
      hi: Hindi
      hu: Hungarian
      `);
      const embed4 = new EmbedBuilder()
        .setAuthor({ name: "Languages", iconURL: client.user.displayAvatarURL() })
        .setColor("Blurple")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(stripIndent`
      **__I-L__**
      is: Icelandic
      id: Indonesian
      ja: Japanese
      kn: Kannada
      ko: Korean
      `);
      const embed5 = new EmbedBuilder()
        .setAuthor({ name: "Languages", iconURL: client.user.displayAvatarURL() })
        .setColor("Blurple")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(stripIndent`
      **__M-P__**
      ms: Malay
      ml: Malayalam
      cmn: Mandarin
      nb: Norwegian
      pl: Polish
      pt: Portuguese
      `);
      const embed6 = new EmbedBuilder()
        .setAuthor({ name: "Languages", iconURL: client.user.displayAvatarURL() })
        .setColor("Blurple")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(stripIndent`
      **__R-Z__**
      ro: Romanian
      ru: Russian
      sr: Serbian
      sk: Slovak
      es: Spanish (Spain)
      es-US: Spanish (US)
      sv: Swedish
      ta: Tamil
      te: Telegu
      th: Thai
      tr: Turkish
      uk: Ukranian
      vi- Vietnamese
      `);
      pagination.setEmbeds([embed1, embed2, embed3, embed4, embed5, embed6]);
      await pagination.send();
    }
  };
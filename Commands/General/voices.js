const { Pagination } = require("pagination.djs");
const data = require("#root/Structures/CustomVoices.js");
module.exports = {
  name: "voices",
  description: "Check all of the custom voices available",
  category: "general",
  async execute(message, args, client) {
    const rawFields = [];
    for (const c of data) {
      rawFields.push({
        name: `<:dot:1108430250003660831> ${c.name}`,
        value: `<a:right:1108683486732234802> \`.setvoice ${c.value}\``,
      });
    }
    const fields = rawFields.sort((a, b) => {
      const aName = a.name;
      const bName = b.name;
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    });

    const pagination = new Pagination(message, {
      firstEmoji: "<:ff:1040299724936323156>",
      prevEmoji: "<:leftarrow:1040299945497993287>",
      nextEmoji: "<:rightarrow:1040299958760374356>",
      lastEmoji: "<:ff2:1040299740245524480>",
      limit: 5,
      idle: 60000,
    })
      .setTitle("Custom Voices List")
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(fields)
      .paginateFields(true)
      .send();
  },
};

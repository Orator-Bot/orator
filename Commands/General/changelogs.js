const { Pagination } = require('pagination.djs');
const Changelogs = require("#root/Structures/Changelogs.js")
module.exports = {
  name: "changelogs",
  description: "Check the logs of the bot.",
  category: "general",
  async execute(message, args, client) {
    const pagination = new Pagination(message, {
      firstEmoji: '<:ff:1040299724936323156>',
      prevEmoji: '<:leftarrow:1040299945497993287>',
      nextEmoji: '<:rightarrow:1040299958760374356>',
      lastEmoji: '<:ff2:1040299740245524480>',
      limit: 1,
      idle: 30000
    });
    pagination.setTitle("📃 Changelogs")
    pagination.setAuthor({
      name: "Orator",
      iconURL: client.user.displayAvatarURL()
    })
    pagination.setColor(client.color)
    pagination.setDescriptions(Changelogs.data)
    pagination.setFooter({
      text: `Page: {pageNumber} of {totalPages}`,
    })
    pagination.send()
  }
}
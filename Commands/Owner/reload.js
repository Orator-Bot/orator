const { loadCommands } = require("#handlers/commandHandler.js");
const { loadLegacy } = require("#handlers/legacyHandler.js");
module.exports = {
  name: "reload",
  description: "Reload events, commands and database.",
  ownerOnly: true,
  category: "dev",
  async execute(message, args, client) {
    const now = Date.now();
    await message.channel
      .send("Reloading Slash and Legacy Commands...")
      .then(async (msg) => {
        loadLegacy(client);
        loadCommands(client);
        await msg.edit(`👍🏻 Reloaded Commands within ${Date.now() - now}ms.`);
      });
    loadCommands(client);
    loadLegacy(client);
  },
};

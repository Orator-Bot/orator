const { loadLegacy } = require("#handlers/legacyHandler.js");
const { loadCommands } = require("#handlers/commandHandler.js");
const { EmbedBuilder, ActivityType } = require("discord.js");
const color = require("colors");
const { AutoPoster } = require("topgg-autoposter");
const ms = require("ms");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const poster = AutoPoster(client.config.TOPGGTOKEN, client);
    client.logger("├─ Client is ready to use.", "success");
    client.logger("├─ Online in " + client.guilds.cache.size + " guilds");
    const prefix = client.config.Prefix;
    client.user.setPresence({
      activities: [
        {
          name: prefix + "help | Cluster: " + client.cluster.id,
          type: ActivityType.Listening,
        },
      ],
    });
    loadCommands(client);
    loadLegacy(client);
    poster.on("posted", (stats) => {
      client.logger(
        `Posted stats to Top.gg | ${stats.serverCount} servers`,
        "success"
      );
    });
  },
};

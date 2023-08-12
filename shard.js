console.clear();
const { ClusterManager } = require("discord-hybrid-sharding");
const config = require("./config");
const { logger } = require("#functions/Logger.js");
const figlet = require("figlet");
const gradient = require("gradient-string");
const colors = require("colors");
const { AutoPoster } = require("topgg-autoposter");
require("./server.js");

const manager = new ClusterManager(`${__dirname}/index.js`, {
  totalShards: "auto",
  shardsPerClusters: 2,
  mode: "process",
  token: config.TOKEN,
});
const poster = AutoPoster(config.TOPGGTOKEN, manager);
manager.on("clusterCreate", (cluster) => {
  // Banner
  console.log(colors.brightMagenta("---------------------"));
  console.log(
    `${gradient.pastel.multiline(figlet.textSync("ORATOR"))}
    ${colors.cyan("V" + require("./package.json").version)}
    ${colors.cyan(`Launched Cluster: ${cluster.id}`)}`
  );
});
manager.spawn({ timeout: -1 });

poster.on("posted", (stats) => {
  logger(`├─ Posted stats to Top.gg | ${stats.serverCount} servers`, "success");
});

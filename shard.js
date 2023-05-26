const { ClusterManager } = require("discord-hybrid-sharding");
const config = require("./config");
require('#root/server.js')
const { logger } = require("#functions/Logger.js")
const manager = new ClusterManager(`${__dirname}/index.js`, {
    totalShards: "auto",
    shardsPerClusters: 2,
    mode: "process",
    token: config.TOKEN,
});

manager.on("clusterCreate", cluster => logger(`Launched Cluster ${cluster.id}`, "success"));
manager.spawn({ timeout: -1 });
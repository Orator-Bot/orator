const { ClusterManager } = require("discord-hybrid-sharding");
const config = require("./config");

const manager = new ClusterManager(`${__dirname}/index.js`, {
    totalShards: "auto",
    shardsPerClusters: 2,
    mode: "process",
    token: config.TOKEN,
});

manager.on("clusterCreate", cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const fs = require("fs");
const { logger } = require("#functions/Logger.js");
const { Player, QueryType } = require("discord-player");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");
const { handleCrashes } = require("@arijitthedev/utils");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Object.keys(Partials)],
  shards: getInfo().SHARD_LIST,
  shardCount: getInfo().TOTAL_SHARDS,
});

client.logger = logger;
client.time = new Date().toLocaleTimeString("en-IN", {
  timeZone: "Asia/Kolkata",
});
client.color = "#486FFA";
client.config = require("#root/config.js");
client.cluster = new ClusterClient(client);

const { loadEvents } = require("#root/Structures/Handlers/eventHandler.js");
const { loadDatabase } = require("#database/Database.js");
const { FakeYouClient } = require("#handlers/FakeYou.js");

client.commands = new Collection();
client.legacy = new Collection();
client.events = new Collection();
client.legacyCommands = new Array();

loadEvents(client);
loadDatabase(client);
FakeYouClient(client);
handleCrashes();

const InitPlayer = async () => {
  const player = new Player(client);
  await player.extractors
    .loadDefault()
    .then(() => {
      client.logger("├─ Player Extractor Initiated.", "success");
    })
    .catch(() => {});
  client.player = player;
};

InitPlayer();

client
  .login(client.config.TOKEN)
  .then(() => {
    client.logger(
      `├─ Logged in the client: ${client.user.username}`,
      "success"
    );
  })
  .catch((err) => {
    client.logger(`├─ Error logging into the client: ${error}`, "warn");
  });

const { Client, GatewayIntentBits, Partials, Collection, WebhookClient, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const color = require("colors");
const Database = require("better-sqlite3");
const { logger } = require("#functions/Logger.js");
const mongoose = require("mongoose");
const { Player, QueryType } = require("discord-player");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");

//Client
const client = new Client({
  intents: [GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates],
  partials: [Object.keys(Partials)],
  shards: getInfo().SHARD_LIST,
  shardCount: getInfo().TOTAL_SHARDS
});

// Universal
client.logger = logger;
client.time = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });
client.color = "#486FFA";
client.config = require("#root/config.js");
client.cluster = new ClusterClient(client);

//Import Values
const { loadEvents } = require("#root/Structures/Handlers/eventHandler.js");
require("#root/Structures/Handlers/crashHandler.js")(client);
const { loadDatabase } = require("#database/Database.js");
const { FakeYouClient } = require("#handlers/FakeYou.js");

//Collections
client.commands = new Collection();
client.legacy = new Collection();
client.events = new Collection();
client.legacyCommands = new Array();

//Load Funtions
loadEvents(client);
loadDatabase(client);
FakeYouClient(client);

const InitPlayer = async () => {
  const player = new Player(client);
  await player.extractors.loadDefault()
    .then(() => {
      client.logger("Player Extractor Initiated.", "success");
    })
    .catch(() => {});
  client.player = player;
};

InitPlayer();

//Login
client.login(client.config.TOKEN)
  .then(() => {
    client.logger(`Logged in the client: ${client.user.tag}`, "success");
  })
  .catch((err) => {
    client.logger(`Error logging into the client: ${error}`, "warn");
  });

// Database Connection
const connectDB = async () => {
  await mongoose.set("strictQuery", true);
  await mongoose.connect(client.config.DB_URL)
    .then(async () => {
      client.logger("Loaded Mongo DB.", "success");
    })
    .catch((err) => {
      client.logger("Error: Unable to login into Mongo DB.", "warn");
    });
};
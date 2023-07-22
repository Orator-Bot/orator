const express = require("express");
const app = express.Router();
app.use(express.json());

const Database = require("better-sqlite3");
const config = require("#root/config.js");

// ---- Code Below ---- //

const authenticate = (req, res, next) => {
  const { username, password } = req.headers;
  if (username !== config.ApiUsername || password !== config.ApiPassword) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// prefix endpoints
const prefixDB = new Database("./Database/prefix.db");
app.post("/setprefix", authenticate, (req, res) => {
  try {
    const { guildId, prefix } = req.body;
    prefixDB
      .prepare("INSERT OR REPLACE INTO prefix(guild, prefix) VALUES(?,?)")
      .run(guildId, prefix);
    console.log(`Successfully changed prefix to ${prefix}`);
    res
      .status(200)
      .json({ message: `Successfully changed prefix to ${prefix}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/resetprefix", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    prefixDB.prepare("DELETE FROM prefix WHERE guild = ?").run(guildId);
    console.log(`Successfully reset the prefix of Guild ID: ${guildId}`);
    res
      .status(200)
      .json({
        message: `Successfully reset the prefix of Guild ID: ${guildId}`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/getprefix", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    const prefixData = prefixDB
      .prepare("SELECT * FROM prefix WHERE guild = ?")
      .get(guildId);
    console.log(`Retrieved prefix: ${prefixData?.prefix}`);
    return res.status(200).json({ message: `${prefixData?.prefix}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// fixed channel endpoints
const fixedChannelDB = new Database("./Database/oratorvc.db");
app.post("/setfvc", authenticate, (req, res) => {
  try {
    const { guildId, channelId } = req.body;
    fixedChannelDB
      .prepare("INSERT OR REPLACE INTO oratorvc(guild, channel) VALUES(?,?)")
      .run(guildId, channelId);
    console.log(`Successfully set the fixed channel to ${channelId}`);
    res
      .status(200)
      .json({ message: `Successfully set the fixed channel to ${channelId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/resetfvc", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    fixedChannelDB.prepare("DELETE FROM oratorvc WHERE guild = ?").run(guildId);
    console.log(`Successfully reset fixed channel for Guild: ${guildId}`);
    res
      .status(200)
      .json({
        message: `Successfully reset fixed channel for Guild: ${guildId}`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/getfvc", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    const fvcData = fixedChannelDB
      .prepare("SELECT * FROM oratorvc WHERE guild = ?")
      .get(guildId);
    console.log(`Retrieved fixed channel: ${fvcData?.channel}`);
    return res.status(200).json({ message: `${fvcData?.channel}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// logging endpoints
const loggingDB = new Database("./Database/logs.db");
app.post("/setlogging", authenticate, (req, res) => {
  try {
    const { guildId, channelId } = req.body;
    loggingDB
      .prepare("INSERT OR REPLACE INTO logsdb(guild, channel) VALUES(?,?)")
      .run(guildId, channelId);
    console.log(`Successfully changed logging to ${channelId}`);
    res
      .status(200)
      .json({ message: `Successfully changed logging to ${channelId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/resetlogging", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    loggingDB.prepare("DELETE FROM logsdb WHERE guild = ?").run(guildId);
    console.log(`Successfully reset the logging of Guild ID: ${guildId}`);
    res
      .status(200)
      .json({
        message: `Successfully reset the logging of Guild ID: ${guildId}`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/getlogging", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    const prefixData = loggingDB
      .prepare("SELECT * FROM logsdb WHERE guild = ?")
      .get(guildId);
    console.log(`Retrieved logging: ${prefixData?.channel}`);
    return res.status(200).json({ message: `${prefixData?.channel}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// tts voice endpoints
const ttsVoiceDB = new Database("./Database/customLang.db");
app.post("/setvoice", authenticate, (req, res) => {
  try {
    const { guildId, soundId } = req.body;
    ttsVoiceDB
      .prepare("INSERT OR REPLACE INTO customLang(guild, sound) VALUES(?,?)")
      .run(guildId, soundId);
    console.log(`Successfully set the TTS voice to ${soundId}`);
    res
      .status(200)
      .json({ message: `Successfully set the TTS voice to ${soundId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/resetvoice", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    ttsVoiceDB.prepare("DELETE FROM customLang WHERE guild = ?").run(guildId);
    console.log(`Successfully reset TTS voice for Guild: ${guildId}`);
    res
      .status(200)
      .json({ message: `Successfully reset TTS voice for Guild: ${guildId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/getvoice", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    const ttsVoiceData = ttsVoiceDB
      .prepare("SELECT * FROM customLang WHERE guild = ?")
      .get(guildId);
    console.log(`Retrieved TTS voice: ${ttsVoiceData?.sound}`);
    return res.status(200).json({ message: `${ttsVoiceData?.sound}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// language endpoints
const languageDB = new Database("./Database/lang.db");
app.post("/setlanguage", authenticate, (req, res) => {
  try {
    const { guildId, language } = req.body;
    languageDB
      .prepare("INSERT OR REPLACE INTO language(guild, lang) VALUES(?,?)")
      .run(guildId, language);
    console.log(`Successfully set the language to ${language}`);
    res
      .status(200)
      .json({ message: `Successfully set the language to ${language}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/resetlanguage", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    languageDB.prepare("DELETE FROM lang WHERE guild = ?").run(guildId);
    console.log(`Successfully reset language for Guild: ${guildId}`);
    res
      .status(200)
      .json({ message: `Successfully reset language for Guild: ${guildId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/getlanguage", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    const languageData = languageDB
      .prepare("SELECT * FROM lang WHERE guild = ?")
      .get(guildId);
    console.log(`Retrieved language: ${languageData?.lang}`);
    return res.status(200).json({ message: `${languageData?.lang}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// webhook text endpoints
const webhookTextDB = new Database("./Database/webhookpanel.db");
app.post("/setwebhooktext", authenticate, (req, res) => {
  try {
    const { guildId, channelId } = req.body;
    webhookTextDB
      .prepare(
        "INSERT OR REPLACE INTO webhookchannel(guild_id, channel) VALUES(?,?)"
      )
      .run(guildId, channelId);
    console.log(`Successfully set the webhook text to "${channelId}"`);
    res
      .status(200)
      .json({ message: `Successfully set the webhook text to "${channelId}"` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/resetwebhooktext", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    webhookTextDB
      .prepare("DELETE FROM webhookchannel WHERE guild_id = ?")
      .run(guildId);
    console.log(`Successfully reset webhook text for Guild: ${guildId}`);
    res
      .status(200)
      .json({
        message: `Successfully reset webhook text for Guild: ${guildId}`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/getwebhooktext", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    const webhookTextData = webhookTextDB
      .prepare("SELECT * FROM webhookchannel WHERE guild_id = ?")
      .get(guildId);
    console.log(`Retrieved webhook text: "${webhookTextData?.channel}"`);
    return res.status(200).json({ message: `${webhookTextData?.channel}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// webhook voice endpoints
const webhookVoiceDB = new Database("./Database/webhookpanel.db");
app.post("/setwebhookvoice", authenticate, (req, res) => {
  try {
    const { guildId, channelId } = req.body;
    webhookVoiceDB
      .prepare(
        "INSERT OR REPLACE INTO webhookvc(guild_id, channel) VALUES(?,?)"
      )
      .run(guildId, channelId);
    console.log(
      `Successfully set the webhook voice to channelId: ${channelId}`
    );
    res
      .status(200)
      .json({
        message: `Successfully set the webhook voice to channelId: ${channelId}`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/resetwebhookvoice", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    webhookVoiceDB
      .prepare("DELETE FROM webhookvc WHERE guild_id = ?")
      .run(guildId);
    console.log(`Successfully reset webhook voice for Guild: ${guildId}`);
    res
      .status(200)
      .json({
        message: `Successfully reset webhook voice for Guild: ${guildId}`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/getwebhookvoice", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    const webhookVoiceData = webhookVoiceDB
      .prepare("SELECT * FROM webhookvc WHERE guild_id = ?")
      .get(guildId);
    console.log(
      `Retrieved webhook voice: channelId ${webhookVoiceData?.channel}`
    );
    return res.status(200).json({ message: `${webhookVoiceData?.channel}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// join to create voice endpoint
const joinToCreateVoiceDB = new Database("./Database/jointocreate.db");
app.post("/setjointocreatevoice", authenticate, (req, res) => {
  try {
    const { guildId, channelId } = req.body;
    joinToCreateVoiceDB
      .prepare(
        "INSERT OR REPLACE INTO jointocreate(guild, channel) VALUES(?,?)"
      )
      .run(guildId, channelId);
    console.log(
      `Successfully set the "join to create" voice to "${channelId}"`
    );
    res
      .status(200)
      .json({
        message: `Successfully set the "join to create" voice to "${channelId}"`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/resetjointocreatevoice", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    joinToCreateVoiceDB
      .prepare("DELETE FROM jointocreate WHERE guild = ?")
      .run(guildId);
    console.log(
      `Successfully reset "join to create" voice for Guild: ${guildId}`
    );
    res
      .status(200)
      .json({
        message: `Successfully reset "join to create" voice for Guild: ${guildId}`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/getjointocreatevoice", authenticate, (req, res) => {
  try {
    const { guildId } = req.body;
    const jointocreateVoiceData = joinToCreateVoiceDB
      .prepare("SELECT * FROM jointocreate WHERE guild = ?")
      .get(guildId);
    console.log(
      `Retrieved "join to create" voice: "${jointocreateVoiceData?.channel}"`
    );
    return res
      .status(200)
      .json({ message: `${jointocreateVoiceData?.channel}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;

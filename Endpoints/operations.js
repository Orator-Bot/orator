const express = require('express')
const app = express.Router()
app.use(express.json())

const Database = require("better-sqlite3")
const config = require("#root/config.js")

// ---- Code Below ---- //

const authenticate = (req, res, next) => {
  const { username, password } = req.headers
  if (username !== config.ApiUsername || password !== config.ApiPassword) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}

// prefix endpoints
const prefixDB = new Database("./Database/prefix.db")
app.post("/setprefix", authenticate, (req, res) => {
  const { guildId, prefix } = req.body
  prefixDB.prepare("INSERT OR REPLACE INTO prefix(guild, prefix) VALUES(?,?)").run(guildId, prefix)
  res.status(200).json({ message: `Successfully changed prefix to ${prefix}`})
})
app.post("/resetprefix", authenticate, (req, res) => {
  const { guildId } = req.body
  prefixDB.prepare("DELETE FROM prefix WHERE guild = ?").run(guildId)
  res.status(200).json({ message: `Successfully reset the prefix of Guild ID: ${guildId}`})
})
app.get("/getprefix", authenticate, (req, res) => {
  const { guildId } = req.body
  const prefixData = prefixDB.prepare("SELECT * FROM prefix WHERE guild = ?").get(guildId)
  return res.status(200).json({ message: `${prefixData.prefix}`})
})

// fixed channel endpoints
const fixedChannelDB = new Database("./Database/oratorvc.db")
app.post("/setfvc", authenticate, (req, res) => {
  const { guildId, channelId } = req.body
  fixedChannelDB.prepare("INSERT OR REPLACE INTO oratorvc(guild, channel) VALUES(?,?)").run(guildId, channelId)
  res.status(200).json({ message: `Successfully set the fixed channel to ${channelId}`})
})
app.post("/resetfvc", authenticate, (req, res) => {
  const { guildId } = req.body
  fixedChannelDB.prepare("DELETE FROM oratorvc WHERE guild = ?").run(guildId)
  res.status(200).json({ message: `Successfully reset fixed channel for Guild: ${guildId}`})
})
app.post("/getfvc", authenticate, (req, res) => {
  const { guildId } = req.body
  const fvcData = fixedChannelDB.prepare("SELECT * FROM oratorvc WHERE guild = ?").get(guildId)
  req.status(200).json({ message: `${fvcData.channel}`})
})

module.exports = app
const express = require('express');
const Database = require('better-sqlite3');
const ms = require('ms');
const config = require('#root/config.js')
const app = express.Router()
app.use(express.json());
const db = new Database('./Database/premium.db');
db.prepare('CREATE TABLE IF NOT EXISTS subscriptions (guild_id TEXT PRIMARY KEY, user_id TEXT, expires INTEGER)').run();
const authenticate = (req, res, next) => {
  const { username, password } = req.headers;
  if (username !== config.ApiUsername || password !== config.ApiPassword) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};
app.post('/purchase', authenticate, (req, res) => {
  const { userId, guildId, time } = req.body;
  if (!userId || !guildId || !time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const expireTime = Date.now() + ms(time);
  const subscription = db.prepare('SELECT * FROM subscriptions WHERE guild_id = ?').get(guildId);
  if (subscription) {
    return res.status(200).json({ message: 'Subscription already available' });
  }
  db.prepare('INSERT INTO subscriptions(guild_id, user_id, expires) VALUES(?,?,?)').run(guildId, userId, expireTime);
  res.status(200).json({ message: 'Purchase data saved successfully' });
});

module.exports = app
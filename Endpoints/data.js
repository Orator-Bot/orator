const express = require('express');
const fs = require("fs")
const app = express.Router();
app.use(express.json());
const config = require("#root/config.js");

const authenticate = (req, res, next) => {
  const { username, password } = req.headers;
  if (username !== config.ApiUsername || password !== config.ApiPassword) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

app.get('/customvoices', authenticate, (req, res) => {
  fs.readFile(`${process.cwd()}/Structures/CustomVoices.js`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    try {
      const dataArray = eval(data);
      const result = dataArray.map(({ name, id }) => ({ name, id }));
      res.json(result);
      console.log(result)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.get("/changelogs", authenticate, (req, res) => {
  const updates = client.updatesdb.prepare("SELECT * FROM updates ORDER BY date DESC").all();
  res.json(updates)
})

module.exports = app
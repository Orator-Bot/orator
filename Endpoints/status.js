const express = require("express");
const app = express.Router();
app.use(express.json());

app.post("/", (req, res) => {
  res.status(200).json({ message: "Orator is online" });
});

module.exports = app;

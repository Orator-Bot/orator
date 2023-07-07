const { loadFiles } = require("@arijitthedev/utils");
const color = require("colors");

async function loadEvents(client) {
  console.time("Events Loaded");
  client.events = new Map();
  const events = new Array();

  const files = await loadFiles("Events");

  for (const file of files) {
    try {
      const event = require(file);
      const execute = (...args) => event.execute(...args, client);
      const target = event.rest ? client.rest : client;
      target[event.once ? "once" : "on"](event.name, execute);
      client.events.set(event.name, execute);
      events.push({
        Event: event.name,
        Status: "🟢"
      });
    } catch (error) {
      events.push({
        Event: file.split("/").pop().slice(0, -3),
        Status: "🛑"
      });
      client.logger(`${file.split("/").pop().slice(0,-3)} - ${error}`);
    }
  }
  client.logger("├─ Events Loaded Successfully.", "success");
}

module.exports = {
  loadEvents
};
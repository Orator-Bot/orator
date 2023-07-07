const color = require("colors");
const { loadFiles } = require("@arijitthedev/utils");
async function loadLegacy(client) {
  const Files = await loadFiles("Commands");
  Files.forEach((file) => {
    const command = require(file);
    client.legacy.set(command.name, command);
      client.legacyCommands.push(command);
  });
  client.logger(`├─ Loaded Prefix Commands: ${client.legacy.size}`, "success");
}
module.exports = { loadLegacy };
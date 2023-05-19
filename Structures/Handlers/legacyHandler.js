const color = require("colors")
async function loadLegacy(client) {
  const { loadFiles } = require('#functions/fileLoader.js');
  const Files = await loadFiles("Commands");
  Files.forEach((file) => {
    const command = require(file)
    client.legacy.set(command.name, command);
      client.legacyCommands.push(command)
  });
  client.logger(`Loaded Prefix Commands: ${client.legacy.size}`, 'success')
}
module.exports = { loadLegacy }
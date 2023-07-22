const color = require("colors");
const { loadFiles } = require("@arijitthedev/utils");
async function loadCommands(client) {
  let commandsArray = [];

  const Files = await loadFiles("SlashCommands");
  Files.forEach((file) => {
    const command = require(file);
    if (command.subCommand)
      return client.subCommands.set(command.subCommand, command);

    client.commands.set(command.data.name, command);
    commandsArray.push(command.data.toJSON());
  });
  client.application.commands.set(commandsArray);
  client.logger(`├─ Loaded Slash Commands: ${client.commands.size}`, "success");
}
module.exports = { loadCommands };

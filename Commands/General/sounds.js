const { EmbedBuilder } = require("discord.js");
const { stripIndent } = require("common-tags");
module.exports = {
  name: "sounds",
  description: "Get the list of the sounds available on Orator Soundboard.",
  category: "general",
  async execute(message, args, client){
    const Embed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(stripIndent`Available Soundboard Sounds: 
    • Airhorn
    • Bass
    • Bye
    • Crying
    • Drumroll
    • Fail
    • Guitar
    • Happy
    • Laughing
    • Okay
    • Sad
    • Sus
    • Tabla
    • Whoareyou
    `)
    .addFields({
      name: "Usage",
      value: "To use the sound, join in a voice channel and use `.soundboard <sound name>`"
    })
    .setTimestamp();
    
    message.channel.send({ embeds: [Embed] });
  }
};
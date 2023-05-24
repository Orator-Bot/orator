const { Player, QueryType } = require("discord-player");
const googleTTS = require("google-tts-api");
module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (!message.guildId) return;
    if (!message.author.bot) return;
    if (message.webhookId === null) return;
    const webhookVC = client.webhookdb.prepare("SELECT * FROM webhookchannel WHERE guild_id = ?").get(message.guild.id);
    const webhookVoice = client.webhookdb.prepare("SELECT * FROM webhookvc WHERE guild_id = ?").get(message.guild.id);
    if (!webhookVC) return;
    if (webhookVC) {
      if (message.channel.id !== webhookVC.channel) return;
      if (!webhookVoice) return message.channel.send("No Webhook Voice Channels were found.")
        .then(async (m) => setTimeout(async () => {
          await m.delete();
        }, 3000));
      const text = message.content;
      let langCode = "en";
      const langData = client.getlang.get(message.guild.id);
      if (langData) langCode = langData.language;
      try {
        const url = googleTTS.getAudioUrl(text, {
          lang: langCode,
          slow: false,
          host: "https://translate.google.com"
        });
        await client.player.play(message.guild.channels.cache.get(webhookVoice.channel), url);
      } catch (error) {
        message.channel.send(`[Error]: ${error.message}`);
      }
    }
  }
};
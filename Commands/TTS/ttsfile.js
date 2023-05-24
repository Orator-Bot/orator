const gtts = require("gtts");
const { Player, QueryType, useQueue } = require("discord-player");
const fs = require("fs");
module.exports = {
  name: "ttsfile",
  description: "Get a Text to speech mp3 file.",
  args: true,
  usage: "<text>",
  aliases: ["mp3"],
  category: "tts",
  async execute(message, args, client) {
    const text = args.join(" ");
    
    const blacklistword = client.getblacklistword.all(message.guild.id).map((row) => row.word);
      if (blacklistword.some((word) => text.toLowerCase().split(" ").includes(word))) {
        await message.delete().catch(err => { });
        return message.channel.send(`${message.author}, you have used a blacklisted word which isn't allowed.`);
      }
      
      const blacklistuser = client.getblacklistuser.all(message.guild.id, message.author.id).map((row) => row.user_id);
      if(blacklistuser.includes(message.author.id)){
        return message.channel.send(`${message.author}, you are blacklisted from using the TTS commands of the bot by a server admin. Contact the admins to remove the blacklist.`);
      }
      
      const roleIds = message.member.roles.cache.map((role) => role.id);
      const blacklistrole = client.getblacklistrole.all(message.guild.id).map((row) => row.role_id);
      if(blacklistrole.some((roleId) => roleIds.includes(roleId))){
        return message.reply("You have a role which is blacklisted from using TTS commands.");
      }
    
    let langCode = "en";
    const hasCustomLang = client.getlang.get(message.guild.id);
    if(hasCustomLang) langCode = hasCustomLang.language;
    try {
      const id = `${Math.floor((Math.random() * message.author.id) + 1)}`;
      const tts = new gtts(text, langCode);
      await tts.save(`./${id}.mp3`, async (err, result) => {
        if (err) throw err;
      });
      const filePath = `${process.cwd()}/${id}.mp3`;
      setTimeout(async () => {
        await message.channel.send({
          content: "> <:__:1086867519706505267> Here is you TTS File(Language: " + langCode + "):",
          files: [filePath]
        });
      }, 350);
      setTimeout(async () => {
        await fs.unlinkSync(filePath);
      }, 1000);
    } catch (err) {
      message.reply({
        content: `[${client.time}]: TTS Timed-Out. Try again!`,
      });
    }
  }
};
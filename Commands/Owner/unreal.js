const axios = require("axios");
const { Player, QueryType, useQueue } = require("discord-player");
module.exports = {
  name: "unreal",
  description: "Test voice",
  ownerOnly: true,
  args: true,
  async execute(message, args, client) {
    const voiceId = args[0];
    const text = args.slice(1).join(" ");
    if (!text) return message.reply("Enter a text too");
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply({
        content: "You aren't in a voice channel.",
      });
    }
    const apiKey = "R2CSxyqEGIcmfhiy--FcV-Dc0Mg29cVjSaHVE1XYo9JZtIORfQilfw";
    const apiUrl = "https://api.v5.unrealspeech.com/speech";
    const requestData = {
      Text: text,
      VoiceId: voiceId,
      OutputFormat: "uri",
      AudioFormat: "mp3",
      Bitrate: "192k",
    };
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
    message.channel.sendTyping();
    axios
      .post(apiUrl, requestData, { headers })
      .then(async (response) => {
        await client.player.play(voiceChannel, response.data, {
          nodeOptions: {
            leaveOnEnd: false,
          },
        });
        await message.channel.send(
          `\`[${voiceId}]\` **${message.author.username} said:** ${text}`
        );
      })
      .catch((error) => {
        console.log(error);
        message.channel.send("Something went wrong: `" + error + "`.");
      });
  },
};

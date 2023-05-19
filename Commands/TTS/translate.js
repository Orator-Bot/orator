const { Player, QueryType, useQueue } = require('discord-player');
const googleTTS = require('google-tts-api')
const { EmbedBuilder } = require("discord.js")
const translate = require("translate-google")

module.exports = {
  name: "translate",
  description: "Text to speech translate command.",
  args: true,
  usage: "<language> <text>",
  aliases: ["tl"],
  category: "tts",
  async execute(message, args, client) {
    const language = args[0]
    const text = args.slice(1).join(" ")
    if (!client.config.Languages.includes(language.toLowerCase())) return message.reply(`Please use a valid language code. Get language codes using \`languages\``)
    try {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        return message.reply({
          content: "You aren't in a voice channel.",
        })
      }

      const channelData = client.getoratorvc.get(message.guild.id)
      if (channelData) {
        if (voiceChannel.id !== channelData.channel) return message.reply(`I'm only allowed to join: <#${channelData.channel}>`)
      }

      const blacklistword = client.getblacklistword.all(message.guild.id).map((row) => row.word)
      if (blacklistword.some((word) => text.toLowerCase().split(' ').includes(word))) {
        await message.delete().catch(err => { })
        return message.channel.send(`${message.author}, you have used a blacklisted word which isn't allowed.`)
      }
      
      const blacklistuser = client.getblacklistuser.all(message.guild.id, message.author.id).map((row) => row.user_id)
      if(blacklistuser.includes(message.author.id)){
        return message.channel.send(`${message.author}, you are blacklisted from using the TTS commands of the bot by a server admin. Contact the admins to remove the blacklist.`)
      }
      
      const roleIds = message.member.roles.cache.map((role) => role.id)
      const blacklistrole = client.getblacklistrole.all(message.guild.id).map((row) => row.role_id)
      if(blacklistrole.some((roleId) => roleIds.includes(roleId))){
        return message.reply(`You have a role which is blacklisted from using TTS commands.`)
      }

      translate(text, {
          to: language
        })
        .then((async (queryData) => {
          const query = queryData
          const url = googleTTS.getAudioUrl(query, { lang: language, slow: false, host: "https://translate.google.com" });


          await client.player.play(voiceChannel, url, {
            nodeOptions: {
              leaveOnEnd: false
            },
          });
          await message.channel.send({
            content: `[${language}] 🎙️ ${message.author.tag} said: **${query}**`
          })
          const logsChannel = client.ttslogs.get(message.guild.id)
          if (logsChannel) {
            const sendchannel = await message.guild.channels.cache.get(logsChannel.channel).send({
                embeds: [new EmbedBuilder()
            .setTitle('TTS Command')
            .setAuthor({
                    name: message.author.tag + " used Translate [" + language + "].",
                    iconURL: message.author.displayAvatarURL()
                  })
            .setDescription(`\`\`\`${text}\`\`\``)
            .setColor('#486FFA')
            .setTimestamp()
            .setFooter({
                    text: `Used in #${message.channel.name}`
                  })
          ]
              })
              .catch(err => {})
          }
        }))
    } catch (err) {
      console.log(err)
      message.reply({
        content: `[${client.time}]: TTS Timed-Out. Try again!`,
      })
    }
  }
}
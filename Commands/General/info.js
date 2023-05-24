const { EmbedBuilder } = require("discord.js");
const { stripIndent } = require("common-tags");
module.exports = {
  name: "info",
  description: "Information about the bot.",
  category: "general",
  async execute(message, args, client) {
    const promises = [
	client.cluster.fetchClientValues("guilds.cache.size"),
	client.cluster.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
];


    Promise.all(promises)
      .then(results => {
        const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
            .setTitle("Orator Bot")
            .setDescription(stripIndent`
            Orator is a Text to Speech generator Discord Bot using which you can generate your own text to speech in 50+ languages or AI generated custom voices. You can also get the TTS file and have the full right to use them.
            
            <:__:1086867519706505267> Current Shard: ${message.guild.shardId}
            <:__:1086867519706505267> Total Shards: ${client.cluster.info.TOTAL_SHARDS}
            <:__:1086867519706505267> Current Cluster: ${client.cluster.id}
            <:__:1086867519706505267> Total Clusters: ${client.cluster.count}
            <:__:1086867519706505267> Total Servers: ${totalGuilds}
            <:__:1086867519706505267> Total Users: ${totalMembers}
            
            __Team Orator__
            <:diamond2:1047876085913763850> RK - Owner
            <:diamond2:1047876085913763850> Arijit - Lead Developer
            <:diamond2:1047876085913763850> RKN - Side Developer
            <:diamond2:1047876085913763850> Frezz1ck - Web Developer
            
            __Important Links__
            Use \`.links\` to see the links related to Orator Bot.
            `)
            .setColor(client.color)
            .setFooter({
              text: `Requested by ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL()
            })
            .setThumbnail(client.user.displayAvatarURL())
            ]
        });
      })
      .catch(console.error);
  }
};
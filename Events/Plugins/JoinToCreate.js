const db = require('pro.db')
const { ChannelType } = require("discord.js")
module.exports = {
  name: 'voiceStateUpdate',
  async execute(OldVoice, NewVoice, client) {
  const Data = client.jtc.get(NewVoice.guild.id)
  if(!Data) return
  if (NewVoice.channelId == Data.channel) {
    await NewVoice.guild.channels.create({
      name: `${NewVoice.member.user.username}'s Channel`,
      type: ChannelType.GuildVoice,
      parent:NewVoice.member.voice.channel.parentId,
      userLimit: NewVoice.member.voice.channel.userLimit
    }).then(async Channel => {
      db.set(`Temporary_${Channel.id}_${OldVoice.member.user.id}`, Channel.id)
      await NewVoice.member.voice.setChannel(Channel)
    })
  }

  setInterval(async () => {
    if (OldVoice.channelId !== null && db.has(`Temporary_${OldVoice.channelId}_${OldVoice.member.user.id}`)) {
      if (OldVoice.channel.members.filter(x => !x.user.bot).size == 0) {
        let channel = OldVoice.guild.channels.cache.get(OldVoice.channelId)
        await channel.delete();
        await db.delete(`Temporary_${OldVoice.channelId}_${OldVoice.member.user.id}`);
      }
    }
  }, 1000)
  }
}
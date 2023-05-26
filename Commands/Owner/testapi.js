const axios = require('axios');
module.exports = {
  name: 'testapi',
  description: 'test api',
  ownerOnly: true,
  args: true,
  usage: "<userid> <guildid> <time>",
  async execute(message, args, client) {
    const apiUrl = 'http://api.oratorbot.xyz:4018/admin/purchase';
    const userId = args[0]
    const guildId = args[1]
    const time = args[2]
    const userTag = await client.users.fetch(userId).then(async u => await u.tag)
    if (!userTag) return message.reply('Invalid User ID')
    const guildName = await client.guilds.fetch(guildId).then(async g => await g.name)
    if (!guildName) return message.reply('Invalid Guild ID')
    const guildIcon = await client.guilds.fetch(guildId).then(async g => await g.iconURL())
    const payload = {
      userId,
      guildId,
      time,
      userTag,
      guildName,
      guildIcon
    };
    axios.post(apiUrl, payload, {
        headers: {
          username: client.config.ApiUsername,
          password: client.config.ApiPassword
        }
      })
      .then(response => {
        message.channel.send(response.data.message);
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
  }
}
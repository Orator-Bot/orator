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
    const payload = {
      userId,
      guildId,
      time
    };
    axios.post(apiUrl, payload, {
      headers: {
        username: "",
        password: ""
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
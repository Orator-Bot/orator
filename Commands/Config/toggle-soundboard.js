module.exports = {
  name: 'toggle-soundboard',
  description: 'Enable / Disable the soundboard in this server',
  permissions: 'Administrator',
  category: "config",
  async execute(message, args, client) {
    const data = client.sbstate.prepare('SELECT * FROM sbstates WHERE guild = ?').get(message.guild.id)
    if(data){
      client.sbstate.prepare('DELETE FROM sbstates WHERE guild = ?').run(message.guild.id)
      message.reply('Soundboard is now enabled.')
    }else{
      client.sbstate.prepare('INSERT INTO sbstates(guild) VALUES(?)').run(message.guild.id)
      message.reply('Soundboard is now disabled.')
    }
  }
}
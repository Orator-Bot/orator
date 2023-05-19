const { EmbedBuilder } = require('discord.js')
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (![
     'select-lang',
     'select-lang-2',
     'select-lang-3'
     ].includes(interaction.customId)) return;
     if(!interaction.member.permissions.has('Administrator')) return interaction.reply({
       content: 'You need Administrator permission to use the Buttons.',
       ephemeral: true
     })
    const LangCode = interaction.values[0]
    client.setlang.run(interaction.guild.id, LangCode)
    await interaction.update({
      content: '',
      embeds: [ new EmbedBuilder().setDescription(':white_check_mark: Set Language to ' + LangCode).setColor(client.color)],
      components: []
    })
  }
}
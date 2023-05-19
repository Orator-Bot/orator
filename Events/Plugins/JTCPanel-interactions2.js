const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder } = require("discord.js")
const db = require('pro.db')
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    if (interaction.isButton()) {
      if (!['UserManager_Mute', 'UserManager_Deafen', 'UsersManager_Unmute', 'UsersManager_Undeafen'].includes(interaction.customId)) return;
      const Channel = interaction.member.voice.channel;
      if (!Channel) return interaction.reply({ content: `You are not in voice channel.`, ephemeral: true })
      const Data = db.get(`Temporary_${Channel.id}_${interaction.user.id}`)
      if (Data !== Channel.id) return interaction.reply({ content: `You are not a owner if the temporary channel`, ephemeral: true })
      switch (interaction.customId) {
        case 'UsersManager_Mute': {
          const Row = new ActionRowBuilder()
            .addComponents(
              new UserSelectMenuBuilder()
              .setPlaceholder('Select the User from the Menu')
              .setCustomId('UserManager_Mute')
              .setMaxValues(1)
            )
          interaction.reply({ content: '_ _', components: [Row], ephemeral: true })
        }
        break;
        case 'UsersManager_Unmute': {
          const Row = new ActionRowBuilder()
            .addComponents(
              new UserSelectMenuBuilder()
              .setPlaceholder('Select the User from the Menu')
              .setCustomId('UserManager_Unmute')
              .setMaxValues(1))
          interaction.reply({ content: '_ _', components: [Row], ephemeral: true })
        }
        break;
        case 'UsersManager_Deafen': {
          const Row = new ActionRowBuilder()
            .addComponents(
              new UserSelectMenuBuilder()
              .setPlaceholder('Select the User from the Menu')
              .setCustomId('UserManager_Deafen')
              .setMaxValues(1)
            )
          interaction.reply({ content: '_ _', components: [Row], ephemeral: true })
        }
        break;
        case 'UsersManager_Undeafen': {
          const Row = new ActionRowBuilder()
            .addComponents(
              new UserSelectMenuBuilder()
              .setPlaceholder('Select the User from the Menu')
              .setCustomId('UserManager_Undeafen')
              .setMaxValues(1)
            )
          interaction.reply({ content: '_ _', components: [Row], ephemeral: true })
        }
      }
    } else if (interaction.isUserSelectMenu()) {
      const Channel = interaction.member.voice.channel;
      if (!Channel) return interaction.reply({ content: `You are not in voice channel.`, ephemeral: true })
      const Data = db.get(`Temporary_${Channel.id}_${interaction.user.id}`)
      if (Data !== Channel.id) return interaction.reply({ content: `You are not a owner if the temporary channel`, ephemeral: true })
      switch (interaction.customId) {
        case 'UserManager_Mute': {
          await interaction.deferUpdate().catch(() => {})
          interaction.member.voice.channel.members.filter((Member) => Member.user.id == interaction.values[0]).forEach((User) => {
            const Member = interaction.guild.members.cache.get(User.id)
            Member.voice.setMute(true)
          })
        }
        break;
        case 'UserManager_Unmute': {
          await interaction.deferUpdate().catch(() => {})
          interaction.member.voice.channel.members.filter((Member) => Member.user.id == interaction.values[0]).forEach((User) => {
            const Member = interaction.guild.members.cache.get(User.id)
            Member.voice.setMute(false)
          })
        }
        break;
        case 'UserManager_Deafen': {
          await interaction.deferUpdate().catch(() => {})
          interaction.member.voice.channel.members.filter((Member) => Member.user.id == interaction.values[0]).forEach((User) => {
            const Member = interaction.guild.members.cache.get(User.id)
            Member.voice.setDeaf(true)
          })
        }
        break;
        case 'UserManager_Undeafen': {
          await interaction.deferUpdate().catch(() => {})
          interaction.member.voice.channel.members.filter((Member) => Member.user.id == interaction.values[0]).forEach((User) => {
            const Member = interaction.guild.members.cache.get(User.id)
            Member.voice.setDeaf(false)
          })
        }
      }
    }

  }
}
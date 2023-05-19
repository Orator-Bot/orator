const db = require('pro.db')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder } = require("discord.js")
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client){
    
  if (interaction.isButton()) {
    if(!['LockChannel', 'UnlockChannel', 'HideChannel', 'UnhideChannel', 'RenameChannel', 'Ban_Member', 'UsersManager'].includes(interaction.customId)) return;
    const Channel = interaction.member.voice.channel;
    if (!Channel) return interaction.reply({ content: `You are not in voice channel.`, ephemeral: true })
    const Data = db.get(`Temporary_${Channel.id}_${interaction.user.id}`)
    if (Data !== Channel.id) return interaction.reply({ content: `You are not a owner if the temporary channel`, ephemeral: true })
    switch (interaction.customId) {
      case 'LockChannel': {
        await interaction.deferUpdate().catch(() => {})
        interaction.member.voice.channel.permissionOverwrites.set([
          {
            id: interaction.guild.roles.everyone.id,
            deny: [
                            PermissionsBitField.Flags.Connect
                        ]
                    },
          {
            id: interaction.user.id,
            allow: [
                            PermissionsBitField.Flags.Connect
                        ]
                    }
                ])
      }
      break;
      case 'UnlockChannel': {
        await interaction.deferUpdate().catch(() => {})
        interaction.member.voice.channel.permissionOverwrites.set([
          {
            id: interaction.guild.roles.everyone.id,
            allow: [
                            PermissionsBitField.Flags.Connect
                        ]
                    }
                ])
      }
      break;
      case 'HideChannel': {
        await interaction.deferUpdate().catch(() => {})
        interaction.member.voice.channel.permissionOverwrites.set([
          {
            id: interaction.guild.roles.everyone.id,
            deny: [
                            PermissionsBitField.Flags.ViewChannel
                        ]
                    },
          {
            id: interaction.user.id,
            allow: [
                            PermissionsBitField.Flags.ViewChannel
                        ]
                    }
                ])
      }
      break;
      case 'UnhideChannel': {
        await interaction.deferUpdate().catch(() => {})
        interaction.member.voice.channel.permissionOverwrites.set([
          {
            id: interaction.guild.roles.everyone.id,
            allow: [
                            PermissionsBitField.Flags.ViewChannel
                        ]
                    }
                ])
      }
      break;
      case 'RenameChannel': {
        const Modal = new ModalBuilder()
          .setCustomId('RenameModal')
          .setTitle('Rename Channel')
        const Name = new TextInputBuilder()
          .setStyle(TextInputStyle.Short)
          .setLabel('THE NEW NAME')
          .setMaxLength(50)
          .setCustomId('Name')
          .setRequired(true)
        const Row = new ActionRowBuilder().addComponents(Name)
        Modal.addComponents(Row)
        interaction.showModal(Modal)
      }
      break;
      case 'Ban_Member': {
        const User = new UserSelectMenuBuilder().setPlaceholder('Select the User').setCustomId('UserMenu').setMaxValues(1)
        const Row = new ActionRowBuilder().addComponents(User)
        interaction.reply({ content: `_ _`, components: [Row], ephemeral: true })
      }
      break;
      case 'UsersManager': {
        const Row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('1085177845065728062')
          .setLabel('Mute')
          .setCustomId('UsersManager_Mute'),
          new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('1085177849322946612')
          .setLabel('Unmute')
          .setCustomId('UsersManager_Unmute'),
          new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('1085177846911221770')
          .setLabel('Deafen')
          .setCustomId('UsersManager_Deafen'),
          new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('1085177842016452698')
          .setLabel('Undeafen')
          .setCustomId('UsersManager_Undeafen'))
        interaction.reply({ content: '_ _', components: [Row], ephemeral: true })
      }
      break;
    }
  } else if (interaction.isStringSelectMenu()) {
    if(interaction.customId !== 'Menu') return;
    const Channel = interaction.member.voice.channel;
    if (!Channel) return interaction.reply({ content: `You are not in voice channel.`, ephemeral: true })
    const Data = db.get(`Temporary_${Channel.id}_${interaction.user.id}`)
    if (Data !== Channel.id) return interaction.reply({ content: `You are not a owner if the temporary channel`, ephemeral: true })
    if (interaction.customId == 'Menu') {
      switch (interaction.values[0]) {
        case 'Mute': {
          await interaction.deferUpdate().catch(() => {})
          Channel.members.forEach(async Members => {
            const Member = interaction.guild.members.cache.get(Members.id)
            if (Member.id !== interaction.user.id) Member.voice.setMute(true)
          })
        }
        break;
        case 'Unmute': {
          await interaction.deferUpdate().catch(() => {})
          Channel.members.forEach(async Members => {
            const Member = interaction.guild.members.cache.get(Members.id)
            if (Member.id !== interaction.user.id) Member.voice.setMute(false)
          })
        }
        break;
        case 'Disconnect': {
          await interaction.deferUpdate().catch(() => {})
          Channel.members.forEach(async Members => {
            const Member = interaction.guild.members.cache.get(Members.id)
            if (Member.id !== interaction.user.id) Member.voice.disconnect()
          })
        }
        break;
        case 'Customize_UserLimit': {
          const Modal = new ModalBuilder()
            .setCustomId('Customize_UsersLimit')
            .setTitle('Customize Users Limit')
          const Number = new TextInputBuilder()
            .setStyle(TextInputStyle.Short)
            .setLabel('The Number')
            .setMaxLength(2)
            .setCustomId('The_Number')
            .setRequired(true)
          const Row = new ActionRowBuilder().addComponents(Number)
          Modal.addComponents(Row)
          interaction.showModal(Modal)
        }
        break;
        case 'Delete_Channel': {
        await interaction.deferUpdate().catch(() => {})
        db.delete(`Temporary_${Channel.id}_${interaction.user.id}`)
        await Channel.delete()
      }
      break;
      }
    }
  } else if (interaction.isModalSubmit()) {
    const Channel = interaction.member.voice.channel;
    if (!Channel) return interaction.reply({ content: `You are not in voice channel.`, ephemeral: true })
    const Data = db.get(`Temporary_${Channel.id}_${interaction.user.id}`)
    if (Data !== Channel.id) return interaction.reply({ content: `You are not a owner if the temporary channel`, ephemeral: true })
    if (interaction.customId == 'RenameModal') {
      const Name = interaction.fields.getTextInputValue('Name')
      await Channel.setName(Name)
      interaction.reply({ content: `The channel has been successfully changed.`, ephemeral: true })
    } else if (interaction.customId == 'Customize_UsersLimit') {
      const Number = interaction.fields.getTextInputValue('The_Number')
      if (Channel.userLimit == Number) return interaction.reply({ content: `The users limit is already \`${Number}\``, ephemeral: true })
      interaction.reply({ content: `The users limit has been changed from \`${Channel.userLimit || '0'}\` to \`${Number}\``, ephemeral: true })
      await Channel.setUserLimit(Number)
    }
  }

  }
}
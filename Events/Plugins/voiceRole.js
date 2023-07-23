module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    const roleData = client.voicerole
      .prepare("SELECT * FROM voicerole WHERE guild = ?")
      .get(newState.guild.id);
    if (!roleData) return;

    const roleId = roleData.role;
    const newUserChannel = newState.channel;
    const oldUserChannel = oldState.channel;

    if (newUserChannel && !oldUserChannel) {
      const member = newState.member;
      const role = newState.guild.roles.cache.get(roleId);
      if (role) {
        await member.roles.add(role).catch(() => null);
      }
    } else if (!newUserChannel && oldUserChannel) {
      const member = oldState.member;
      const role = oldState.guild.roles.cache.get(roleId);
      if (role) {
        await member.roles.remove(role).catch(() => null);
      }
    }
  },
};

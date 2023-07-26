const { stripIndent } = require("common-tags");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "v5",
  description: "Get the news of v5 release",
  async execute(message, args, client) {
    const embed = new EmbedBuilder().setColor(client.color)
      .setDescription(stripIndent`
    # Orator V5 Update

    > In this update we have improved a lot of things and optimised our code.
    
    __**New Features:**__
    1. Panel now have 3 TTS Voice API options: **Google TTS API, Orator Male TTS API, Fakeyou Custom Voice API.**
    2. A new command \`panelconfig\` which will have additional configuration settings. For now you can only change the Voice API there.
    3. A new button in panel: **"Change Voice"** which can be used to change the voice of the selected TTS Provider. It will only work when you'll select Orator Male TTS.
    4. A voice role feature which assigns a role to a user when he/she joins the voice channel. You can set one using \`setvoicerole\`. Also the role will be removed when he/she leaves the channel. You can use \`resetvoicerole\` to reset the voice role.
    5. A new TTS command: Male TTS (\`.mtts\` or \`.maletts\`) which uses Orator's Male TTS.
    
    __**What are removed in this update?**__
    1. We removed the **Soundboard** system completely because Discord added their own Soundboard system. (If you want it back, you can request for it).
    2. Optimised the code and removed a lot of bugs.
    3. We also removed the **Join to Create** feature as we are thinking of creating a separate bot for this.
    
    __**Updated Things:**__
    1. You can now set prefix upto 5 characters only.
    `);

    await message.channel.send({
      embeds: [embed],
    });
  },
};

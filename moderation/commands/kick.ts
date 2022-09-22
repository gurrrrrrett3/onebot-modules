import { PermissionFlagsBits } from "discord.js";
import SlashCommandBuilder from "../../../core/loaders/objects/customSlashCommandBuilder";

const Command = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick a user from the server")
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .setDMPermission(false)
  .addUserOption((option) => option.setName("user").setDescription("The user to kick").setRequired(true))

  .setFunction(async (interaction) => {
    const user = interaction.options.getUser("user", true);
    const member = interaction.guild?.members.cache.get(user.id);
    if (!member) {
      interaction.reply("User not found");
      return;
    }
    await member.kick();
    interaction.reply({
        ephemeral: true,
        content: `User kicked`,
    });
  });

export default Command;

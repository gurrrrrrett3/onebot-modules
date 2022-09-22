import { PermissionFlagsBits } from "discord.js";
import { db } from "../../../core";
import SlashCommandBuilder from "../../../core/loaders/objects/customSlashCommandBuilder";
import Time from "../../../core/utils/time";

const Command = new SlashCommandBuilder()
  .setName("tempban")
  .setDescription("Temporarily ban a user from the server")
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .setDMPermission(false)
  .addUserOption((option) => option.setName("user").setDescription("The user to ban").setRequired(true))
  .addStringOption((option) =>
    option.setName("time").setDescription("The time for the ban").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("reason").setDescription("The reason for the ban").setRequired(false)
  )
  .setFunction(async (interaction) => {
    const user = interaction.options.getUser("user", true);
    const time = interaction.options.getString("time", true);
    const reason = interaction.options.getString("reason", false);

    const member = interaction.guild?.members.cache.get(user.id);
    if (!member) {
      interaction.reply("User not found");
      return;
    }

    let timeData: Time;

    try {
      timeData = new Time(time);
    } catch (error) {
      interaction.reply("Invalid time unit");
      return;
    }

    const timeMs = timeData.ms();

    try {
      await member
        .ban({
          reason: `Banned for ${timeData.toString()} by ${interaction.user.tag} for "${reason || "No reason provided"}"`,
        })
        .catch(() => {
          interaction.reply("Failed to ban user");
          return;
        });

      await interaction.reply({
        content: `User banned for ${timeData.toString()}`,
        ephemeral: true,
      });

      const dbBanData = await db.ban
        .create({
          data: {
            user: user.id,
            guild: interaction.guildId as string,
            moderator: interaction.user.id,
            reason: reason || "No reason provided",
            expiresAt: new Date(Date.now() + timeMs),
          },
        })
        .catch((err) => console.error(err));

      setTimeout(async () => {
        await interaction.guild?.members.unban(user.id, `Ban id ${dbBanData?.id} expired.`);
      }, timeMs);
    } catch (error) {
      console.error(error);
    }
  });

export default Command;

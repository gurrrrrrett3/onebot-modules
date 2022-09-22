import { ChannelType, PermissionFlagsBits } from "discord.js";
import SlashCommandBuilder from "../../../core/loaders/objects/customSlashCommandBuilder";

const Command = new SlashCommandBuilder()
  .setName("purge")
  .setDescription("Delete a number of messages")
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("The amount of messages to delete")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100)
  )
  .setFunction(async (interaction) => {
    const amount = interaction.options.getInteger("amount", true);

    if (interaction.channel?.type === ChannelType.DM) return;

    await interaction.channel?.bulkDelete(amount, true);

    interaction.reply({
      content: `Deleted ${amount} messages`,
      ephemeral: true,
    });
  });

export default Command;

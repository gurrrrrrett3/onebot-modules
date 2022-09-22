import { client, db } from "../../../core";

export default async function LoadBans() {
  const bans = await db.ban.findMany({
    where: {
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  bans.forEach(async (ban) => {
    const guild = await client.guilds.fetch(ban.guild);
    const user = await client.users.fetch(ban.user);

    setTimeout(async () => {
      await guild.members.unban(user.id);
    }, ban.expiresAt.getTime() - Date.now());
  });
}

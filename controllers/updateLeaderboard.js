import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateLeaderboard(gameweekId) {
  const users = await prisma.user.findMany({
    include: {
      team: {
        include: {
          players: {
            include: {
              performances: true,
            },
          },
          bench: true, 
        },
      },
    },
  });

  for (const user of users) {
    if (!user.team) continue;

    let totalPoints = 0;
    const fieldPlayers = user.team.players.filter(
      (_, index) => user.team.bench[index] === 0
    );

    for (const player of fieldPlayers) {
      const performance = player.performances.find(
        (p) => p.gameweekId === gameweekId
      );
      if (performance) {
        totalPoints += performance.totalPoints;
      }
    }

    const lastLeaderboardEntry = await prisma.leaderboard.findFirst({
      where: { userId: user.id },
      orderBy: { gameweekId: "desc" }, 
    });

    const previousTotalScore = lastLeaderboardEntry?.totalScore || 0;
    const totalScore = previousTotalScore + totalPoints; // Add current gameweek's points

    await prisma.leaderboard.upsert({
      where: { userId_gameweekId: { userId: user.id, gameweekId } },
      update: { totalPoints, totalScore },
      create: { userId: user.id, gameweekId, totalPoints, totalScore, rank: 0 },
    });
  }

}

// async function updateLeaderboardRanks(gameweekId) {
//     const leaderboardEntries = await prisma.leaderboard.findMany({
//       where: { gameweekId }, // Ensure it's for the current gameweek
//       orderBy: { totalScore: "desc" },
//     });
  
//     for (let i = 0; i < leaderboardEntries.length; i++) {
//       await prisma.leaderboard.update({
//         where: { id: leaderboardEntries[i].id },
//         data: { rank: i + 1 },
//       });
//     }
//   }
  


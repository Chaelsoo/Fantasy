import { PrismaClient } from '@prisma/client';
import { updateLeaderboard } from './updateLeaderboard';

const prisma = new PrismaClient();

export async function simulateMatch(matchId, gameweekId) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        teamA: { include: { players: true } },
        teamB: { include: { players: true } },
      },
    });

    if (!match) {
      console.log(`Match ${matchId} not found`);
      return;
    }

    const players = [...match.teamA.players, ...match.teamB.players];
    let teamAScore = 0;
    let teamBScore = 0;

    for (let i = 0; i < 600; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const player = players[Math.floor(Math.random() * players.length)];
      const eventType = Math.random();
      let event = null;
      let points = 0;

      if (eventType < 0.01) {
        event = 'goal';
        points = 5;
        if (match.teamA.players.some((p) => p.id === player.id)) {
          teamAScore++;
        } else {
          teamBScore++;
        }
      } else if (eventType < 0.02) {
        event = 'assist';
        points = 3;
      } else if (eventType < 0.025) {
        event = 'yellowCard';
        points = -1;
      } else if (eventType < 0.026) {
        event = 'redCard';
        points = -3;
      }

      if (event) {
        await prisma.performance.upsert({
          where: { playerId_gameweekId: { playerId: player.id, gameweekId } },
          update: { totalPoints: { increment: points } },
          create: { playerId: player.id, gameweekId, totalPoints: points },
        });

        await updateLeaderboard(gameweekId);
      }
    }

    await prisma.match.update({
      where: { id: matchId },
      data: { teamAScore, teamBScore },
    });

    console.log(`Match ${matchId} simulation completed.`);
  } catch (error) {
    console.error(`Error simulating match ${matchId}:`, error);
  }
}

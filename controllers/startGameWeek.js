import { PrismaClient } from '@prisma/client';
import { simulateMatch } from './simulateGameWeek';

const prisma = new PrismaClient();

export async function startGameweek(gameweekId) {
  try {
    const gameweek = await prisma.gameweek.findUnique({ where: { id: gameweekId } });
    if (!gameweek) throw new Error('Gameweek not found');

    // Fetch all matches in this gameweek
    const matches = await prisma.match.findMany({ where: { gameweekId } });

    for (const match of matches) {
      await simulateMatch(match);
    }

    // After simulation, update leaderboard
    // await updateLeaderboard(gameweekId);

    console.log(`Gameweek ${gameweekId} started and matches simulated.`);
  } catch (error) {
    console.error('Error starting gameweek:', error.message);
  }
}

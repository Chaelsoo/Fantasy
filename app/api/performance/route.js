import { PrismaClient } from '@prisma/client';
import { updateLeaderboard } from '@/controllers/updateLeaderboard';

const prisma = new PrismaClient();

export async function POST(req) {
    const body = await req.json();
    const { playerId, gameweekId, goalsScored, assists, cleanSheet, yellowCards, redCards } = body;
  
    const totalPoints = goalsScored * 4 + assists * 3 + (cleanSheet ? 5 : 0) - yellowCards - redCards * 3;
  
    try {
      await prisma.performance.upsert({
        where: { playerId_gameweekId: { playerId, gameweekId } },
        update: { goalsScored, assists, cleanSheet, yellowCards, redCards, totalPoints },
        create: { playerId, gameweekId, goalsScored, assists, cleanSheet, yellowCards, redCards, totalPoints },
      });
  
      await updateLeaderboard(gameweekId);
  
      return Response.json({ message: "Performance updated and leaderboard refreshed" });
    } catch (error) {
      return Response.json({ message: "Failed to update performance", error: error.message }, { status: 400 });
    }
  }
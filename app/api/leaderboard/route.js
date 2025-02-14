import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: { totalScore: "desc" },
      include: { user: { select: { username: true } } },
    });
    

    return Response.json({ leaderboard }, { status: 200 });
  } catch (error) {
    return Response.json({ message: 'Failed to fetch leaderboard', error: error.message }, { status: 500 });
  }
}


//get user total points per gameweek
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId || isNaN(userId)) {
      return Response.json({ message: 'Invalid or missing userId' }, { status: 400 });
    }

    // Fetch total points for each gameweek the user has participated in
    const gameweekPoints = await prisma.leaderboard.findMany({
      where: { userId },
      select: {
        gameweekId: true,
        totalPoints: true,
      },
      orderBy: { gameweekId: 'asc' }, // Order by gameweek for chronological data
    });

    return Response.json({
      message: 'User total points per gameweek retrieved successfully',
      gameweekPoints,
    }, { status: 200 });
  } catch (error) {
    return Response.json({ message: 'Failed to fetch user points', error: error.message }, { status: 500 });
  }
}

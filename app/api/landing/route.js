import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req, res) {
    try {
        const userId = req.headers.get('x-user-id');
        console.log("userId", userId);
            
        if (!userId) {
            return res.status(400).json({ error: 'User not authenticated' });
        }   

        const appState = await prisma.appState.findFirst({
            select: {
                currentGameweekId: true
            }
        });
        const currentGameweekId = appState.currentGameweekId;

        const userPointsResult = await prisma.leaderboard.findFirst({
            where: {
                userId: userId,
                gameweekId: currentGameweekId
            },
            select: {
                totalPoints: true
            }
        });
        
        const totalPoints = userPointsResult ? userPointsResult.points : 0;

        const maxPointsResult = await prisma.leaderboard.aggregate({
            _max: {
                totalPoints: true
            },
            where: {
                gameweekId: currentGameweekId
            }
        });
        const maxPoints = maxPointsResult._max.points;

        const avgPointsResult = await prisma.leaderboard.aggregate({
            _avg: {
                totalPoints: true
            },
            where: {
                gameweekId: currentGameweekId
            }
        });
        const avgPoints = avgPointsResult._avg.points;

        res.json({
            currentGameweekId,
            totalPoints,
            maxPoints,
            avgPoints
        });
    } catch (error) {
        console.error('Error fetching points summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

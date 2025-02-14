import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req, res) {
    try {
        const userId = req.userId;  // AUTH MIDDLEWARE

        if (!userId) {
            return res.status(400).json({ error: 'User not authenticated' });
        }

        // Fetch current gameweek ID from appState
        const appState = await prisma.appState.findFirst({
            select: {
                currentGameweekId: true
            }
        });
        const currentGameweekId = appState.currentGameweekId;

        // Fetch total points for the logged-in user in the current gameweek
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

        // Fetch maximum points of all users for the current gameweek
        const maxPointsResult = await prisma.leaderboard.aggregate({
            _max: {
                totalPoints: true
            },
            where: {
                gameweekId: currentGameweekId
            }
        });
        const maxPoints = maxPointsResult._max.points;

        // Fetch average points of all users for the current gameweek
        const avgPointsResult = await prisma.leaderboard.aggregate({
            _avg: {
                totalPoints: true
            },
            where: {
                gameweekId: currentGameweekId
            }
        });
        const avgPoints = avgPointsResult._avg.points;

        // Send the response
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

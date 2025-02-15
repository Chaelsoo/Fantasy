
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function passGameWeek(req, res) {
    try {
        const appState = await prisma.appState.findFirst();
        if (!appState || !appState.currentGameweekId) {
            return res.status(400).json({ error: 'Current gameweek not set' });
        }
        const currentGameweekId = appState.currentGameweekId;

        const currentGameweek = await prisma.gameweek.findUnique({
            where: {
                id: currentGameweekId
            },
            select: {
                endDate: true
            }
        });
        if (!currentGameweek) {
            return res.status(400).json({ error: 'Current gameweek not found' });
        }
        const currentGameweekEndDate = currentGameweek.endDate;

        // Fetch the next gameweek that has the least greatest start date after the current game's end date
        const nextGameweek = await prisma.gameweek.findFirst({
            where: {
                startDate: {
                    gt: currentGameweekEndDate
                }
            },
            orderBy: {
                startDate: 'asc'  // Get the earliest start date after the current gameweek's end date
            }
        });

        if (!nextGameweek) {
            return res.status(400).json({ error: 'No upcoming gameweek found' });
        }

        await prisma.appState.update({
            where: {
                id: appState.id
            },
            data: {
                currentGameweekId: nextGameweek.id
            }
        });

        res.json({
            message: 'Successfully passed to the next gameweek',
            nextGameweekId: nextGameweek.id,
            nextGameweekStartDate: nextGameweek.startDate
        });
    } catch (error) {
        console.error('Error passing gameweek:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const userId = req.headers.get('x-user-id');
        console.log("userId", userId);
        const players = await prisma.player.findMany();  
  
        if (!players || players.length === 0) {
            return Response.json({ message: 'No players found' }, { status: 404 });
        }
  
        return Response.json({ players }, { status: 200 });
    } catch (error) {
        return Response.json({ message: 'Failed to fetch players', error: error.message }, { status: 400 });
    }
}

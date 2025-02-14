import { prisma } from "@/lib/prisma";


export async function GET(req) {
    // const userId = authenticate(req);
    // if (!userId) return Response.json({ message: 'Unauthorized' }, { status: 401 });
  
    try {
      const team = await prisma.team.findUnique({
        where: { userId },
        include: { players: true },
      });
  
      if (!team) return Response.json({ message: 'No team found' }, { status: 404 });
  
      return Response.json({ team }, { status: 200 });
    } catch (error) {
      return Response.json({ message: 'Failed to fetch team', error: error.message }, { status: 400 });
    }
  }

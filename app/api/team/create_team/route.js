import { prisma } from "@/lib/prisma";


export async function POST(req) {
  try {
    const body = await req.json();  
    const { name, playerIds, bench, budget } = body;
    
    const userId = req.user.userId; //auth middleware to get token

    const existingTeam = await prisma.team.findUnique({
      where: { userId },
    });

    if (existingTeam) {
      return Response.json({ message: 'User already has a team' }, { status: 400 });
    }

    if (playerIds.length !== 15 || bench.length !== 15) {
      return Response.json({ message: 'A team must have 15 players and 15 bench values' }, { status: 400 });
    }

    const benchCount = bench.filter((value) => value === 1).length;
    if (benchCount !== 4) {
      return Response.json({ message: 'A team must have 4 players on the bench' }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: {
        name,
        userId,
        playerIds,
        bench,
        budget,
      },
    });

    return Response.json({ message: 'Team created', team }, { status: 201 });
  } catch (error) {
    console.error(error); 
    return Response.json({ message: 'Team creation failed', error: error.message }, { status: 400 });
  } 
}



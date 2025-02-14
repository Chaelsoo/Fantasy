import { prisma } from "@/lib/prisma";


export async function GET(req) {
    try {
        const clubs = await prisma.club.findMany();  // Get all clubs from the Club table
  
        if (!clubs || clubs.length === 0) {
            return Response.json({ message: 'No clubs found' }, { status: 404 });
        }
  
        return Response.json({ clubs }, { status: 200 });
    } catch (error) {
        return Response.json({ message: 'Failed to fetch clubs', error: error.message }, { status: 400 });
    }
}

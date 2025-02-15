import { startGameweek } from "@/controllers/startGameWeek";

export async function POST(req, res) {
  startGameweek(req, res)
  return Response(200, { message: 'Gameweek started' });
}
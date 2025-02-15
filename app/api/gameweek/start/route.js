import { startGameweek } from "@/controllers/startGameWeek";

export async function POST(req, res) {
  startGameweek(req, res)
  return Response.json({ message: 'Gameweek started', }, { status: 200 });}
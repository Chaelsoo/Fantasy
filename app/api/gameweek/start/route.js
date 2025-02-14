import { startGameweek } from "@/controllers/startGameWeek";

export async function POST(req, res) {
  return startGameweek(req, res);
}
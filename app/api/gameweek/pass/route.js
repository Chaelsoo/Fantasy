// pages/api/gameweek/pass.js or a similar path in Next.js
import { passGameWeek } from '@/controllers/passGameWeek';  // Import the passGameWeek handler

export default async function POST(req, res) {
        return passGameWeek(req, res);
}

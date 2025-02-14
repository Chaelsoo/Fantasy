import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';


export async function POST(req, res) {
  const body = await req.json(); 
  const { username, email, password } = body;
  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // Create a new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    return Response.json({ message: 'User created', user }, { status: 201 });
  } catch (error) {
    return Response.json({ message: 'User creation failed', error: error.message }, { status: 400 });
  }
}
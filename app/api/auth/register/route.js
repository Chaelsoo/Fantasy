import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function POST(req, res) {
  const { username, email, password } = req.body;

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

    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(400).json({ message: 'User creation failed', error: error.message });
  }
}
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';


const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    console.log("isPasswordValid", isPasswordValid);
    if (!isPasswordValid) {
      return Response.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Generate a JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Encode the secret
    const token = await new SignJWT({ userId: user.id }) // Payload includes userId
      .setProtectedHeader({ alg: 'HS256' }) // Algorithm
      .setIssuedAt() // Set issued at time
      .setExpirationTime('24h') // Token expires in 24 hours
      .sign(secret); // Sign the token


    return Response.json({ message: 'Login successful', token }, { status: 200 });
  } catch (error) {
    return Response.json({ message: 'Login failed', error: error.message }, { status: 400 });
  }
}

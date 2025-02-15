import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  console.log(`Middleware triggered for: ${request.url}`);
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  console.log(authHeader);
  if (!token) {
    return NextResponse.json(
      { error: 'Authorization token required' },
      { status: 401 }
    )};
    try {
        // Verify and decode the token
    // Verify the token using jose
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        console.log(payload)


            const response = NextResponse.next();
            response.headers.set('x-user-id', payload.userId);

            return response;
    
      } catch (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
  }


  export const config = {
    matcher: [

      '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
  };
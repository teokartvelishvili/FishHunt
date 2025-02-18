// import { NextResponse } from 'next/server';
// import { signToken, getUserIdFromToken, createTokenCookie } from '../auth';
// import { type NextRequest } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const token = request.cookies.get('token')?.value;

//     if (!token) {
//       return NextResponse.json(
//         { error: 'No token provided' },
//         { status: 401 }
//       );
//     }

//     const userId = getUserIdFromToken(token);
    
//     if (!userId) {
//       return NextResponse.json(
//         { error: 'Invalid token' },
//         { status: 401 }
//       );
//     }

//     const newToken = signToken(userId);
//     const response = NextResponse.json({ success: true });
    
//     // ახალი ქუქის დაყენება
//     response.cookies.set(createTokenCookie(newToken));

//     return response;

//   } catch (error) {
//     console.error('Refresh token error:', error);
//     return NextResponse.json(
//       { error: 'Token refresh failed' },
//       { status: 500 }
//     );
//   }
// } 
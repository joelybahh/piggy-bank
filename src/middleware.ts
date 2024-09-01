import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth'; // Adjust the import path as necessary

// Define public paths, including patterns for dynamic routes
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/api/login',
  '/api/register',
  '/bank/*',
];

function isPublicPath(path: string): boolean {
  return publicPaths.some(publicPath => {
    if (publicPath.endsWith('/*')) {
      const basePath = publicPath.slice(0, -2); // Remove the *

      return path.startsWith(basePath);
    }
    // For non-wildcard paths, use exact match
    return publicPath === path;
  });
}

export async function middleware(request: NextRequest) {
  // Check if the requested path is public
  if (isPublicPath(request.nextUrl.pathname)) {
    console.log('public path')
    return NextResponse.next();
  }

  // Get the token from the cookies
  const token = request.cookies.get('session_token')?.value;

  if (!token) {
    // Redirect to login if there's no token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token
    const payload = await verifyToken(token);

    if (!payload) {
      throw new Error('Invalid token');
    }

    // If the token is valid, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
};
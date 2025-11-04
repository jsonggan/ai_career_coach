import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const userScopes = token.scopes as string[] || ['user'];

    // Define route permissions
    const routePermissions = {
      '/personal-growth': ['user', 'admin'],
      '/student': ['student', 'admin'],
      '/admin': ['admin'],
      '/api/v1': ['user', 'student', 'admin'], // API routes need authentication
    };

    // Check if user has required scope for the route
    for (const [route, requiredScopes] of Object.entries(routePermissions)) {
      if (pathname.startsWith(route)) {
        const hasPermission = requiredScopes.some(scope => userScopes.includes(scope));
        
        if (!hasPermission) {
          // Redirect to unauthorized page or login
          return NextResponse.redirect(new URL('/login?error=unauthorized', req.url));
        }
        break;
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/personal-growth/:path*',
    '/student/:path*',
    '/admin/:path*',
    '/api/v1/:path*',
    // Exclude auth routes and static files
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)',
  ],
};

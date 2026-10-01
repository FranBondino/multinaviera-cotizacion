import { NextResponse } from 'next/server';
import { verifySessionToken } from './lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Allow internal Next.js assets, auth endpoints, and favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // 2. Validate cookie session
  const token = request.cookies.get('almar_session')?.value;
  const isAuthenticated = token ? await verifySessionToken(token) : false;

  // 3. If visiting login page while already authenticated, redirect to home
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 4. Protect private routes: if not authenticated, redirect or reject
  if (!isAuthenticated) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado. Inicie sesión.' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

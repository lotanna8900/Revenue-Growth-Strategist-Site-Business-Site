// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  let userRole = 'public';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    userRole = profile?.role || 'user';
  }

  // 1. Protect routes based on role
  const protectedPaths = ['/admin', '/account'];
  if (userRole === 'public' && protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    // User is not logged in, build the redirect URL
    const redirectUrl = new URL('/auth', request.url);
    // Add the page they were trying to access as a query param
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (userRole === 'user' && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  // 2. Redirect logged-in users away from auth pages
  const authPages = ['/login', '/auth'];
  if (userRole !== 'public' && authPages.includes(request.nextUrl.pathname)) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }
  
  // 3. Redirect admin away from public account page
  if (userRole === 'admin' && request.nextUrl.pathname.startsWith('/account')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/login',
    '/auth',
  ],
};
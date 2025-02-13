import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from '@/env'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
    const cookie = request.cookies.get('Authorization')
    if (cookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const cookie = request.cookies.get('Authorization')
    if (!cookie) {
      return NextResponse.redirect(new URL('/login?redirect=' + request.nextUrl.pathname, request.url))
    }

    try {
      await jwtVerify(cookie.value, new TextEncoder().encode(env.JWT_SECRET), {
        algorithms: ['HS256'],
        issuer: env.NEXT_PUBLIC_BASE_URL,
        audience: env.NEXT_PUBLIC_BASE_URL,
      })
      return NextResponse.next()
    } catch (_error) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('Authorization', '', {
        expires: new Date(0),
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      })
      return response
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/login/:path*', '/register/:path', '/dashboard/:path*'],
}

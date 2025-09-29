import { headers } from 'next/headers'
import { auth } from '@dpin-uptime/auth/server'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    if (request.nextUrl.pathname !== '/sign-in') {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  if (session && request.nextUrl.pathname === '/sign-in') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/dashboard', '/sign-in'], // Apply middleware to specific routes
}

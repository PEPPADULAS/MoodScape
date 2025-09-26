import { NextRequest, NextFetchEvent, NextResponse } from 'next/server'

export function middleware(request: NextRequest, event: NextFetchEvent) {
  // Check for overly large headers that might cause 431 errors
  const headers = request.headers
  let totalHeaderSize = 0
  
  headers.forEach((value, key) => {
    totalHeaderSize += key.length + (value?.length || 0)
  })
  
  // If headers are too large, redirect to a clean state
  if (totalHeaderSize > 8000) { // 8KB limit
    const response = NextResponse.redirect(new URL('/auth/signin', request.url))
    // Clear cookies to reduce header size
    response.cookies.delete('next-auth.session-token')
    response.cookies.delete('next-auth.csrf-token')
    return response
  }
  
  return NextResponse.next()
}

// Periodic cleanup function to prevent cookie bloat
export function cleanupSessionCookies(response: NextResponse) {
  // Ensure cookies don't grow too large
  const sessionToken = response.cookies.get('next-auth.session-token')
  if (sessionToken && sessionToken.value.length > 4000) {
    // If session token is too large, force a new session
    response.cookies.delete('next-auth.session-token')
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
import { NextRequest, NextFetchEvent, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Check for overly large headers that might cause 431 errors
  const headers = request.headers
  let totalHeaderSize = 0
  
  headers.forEach((value, key) => {
    totalHeaderSize += key.length + (value?.length || 0)
  })
  
  console.log('Total header size:', totalHeaderSize)
  
  // If headers are extremely large, redirect to a clean state
  if (totalHeaderSize > 12000) { // Increased limit to 12KB
    console.log('Header size too large, clearing cookies')
    const response = NextResponse.redirect(new URL('/auth/signin', request.url))
    // Clear cookies to reduce header size
    response.cookies.delete('next-auth.session-token')
    response.cookies.delete('next-auth.csrf-token')
    response.cookies.delete('next-auth.callback-url')
    response.cookies.delete('next-auth.pkce.code_verifier')
    return response
  }
  
  // Also check individual cookie sizes
  const sessionToken = request.cookies.get('next-auth.session-token')
  if (sessionToken && sessionToken.value.length > 8000) { // Increased limit
    console.log('Session token too large, clearing')
    const response = NextResponse.redirect(new URL('/auth/signin', request.url))
    response.cookies.delete('next-auth.session-token')
    return response
  }
  
  return NextResponse.next()
}

// Periodic cleanup function to prevent cookie bloat
export function cleanupSessionCookies(response: NextResponse) {
  // Ensure cookies don't grow too large
  const sessionToken = response.cookies.get('next-auth.session-token')
  if (sessionToken && sessionToken.value.length > 8000) { // Increased limit
    // If session token is too large, force a new session
    response.cookies.delete('next-auth.session-token')
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
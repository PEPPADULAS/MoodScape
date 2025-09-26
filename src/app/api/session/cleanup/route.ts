import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'No active session' },
        { status: 200 }
      )
    }

    // Return a minimal response to avoid large payloads
    return NextResponse.json({ 
      message: 'Session active'
      // Removed userId to avoid type issues
    })
  } catch (error) {
    console.error('Session cleanup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
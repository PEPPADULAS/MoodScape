import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const now = new Date()
    
    // Find reminders that are due (notifyAt is in the past and not yet notified)
    const dueReminders = await prisma.event.findMany({
      where: {
        userId: user.id,
        notifyAt: {
          lte: now // notifyAt is less than or equal to now
        },
        // We could add a 'notified' field to track which reminders have been shown
        // For now, we'll show all due reminders
      },
      select: {
        id: true,
        title: true,
        note: true,
        date: true,
        notifyAt: true
      },
      orderBy: {
        notifyAt: 'asc'
      }
    })

    return NextResponse.json(dueReminders)
  } catch (error) {
    console.error('Error fetching due reminders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

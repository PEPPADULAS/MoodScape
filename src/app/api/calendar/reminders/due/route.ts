import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Session:', session) // Debug log
    
    if (!session?.user?.email) {
      console.log('Unauthorized access attempt') // Debug log
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    
    console.log('User found:', user?.id) // Debug log

    if (!user) {
      console.log('User not found') // Debug log
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const now = new Date()
    console.log('Current time:', now.toISOString()) // Debug log
    
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
    
    console.log('Due reminders found:', dueReminders.length) // Debug log

    return NextResponse.json(dueReminders)
  } catch (error) {
    console.error('Error fetching due reminders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
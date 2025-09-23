import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/calendar/events?start=YYYY-MM-DD&end=YYYY-MM-DD
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    const where: any = { userId: user.id }
    if (start && end) {
      where.date = { gte: new Date(start), lte: new Date(end) }
    }

    const events = await prisma.event.findMany({ where, orderBy: { date: 'asc' } })
    return NextResponse.json(events)
  } catch (e) {
    console.error('Events list error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/calendar/events
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { date, title, note, notifyAt } = await req.json()
    if (!date || !title) return NextResponse.json({ error: 'date and title are required' }, { status: 400 })

    const event = await prisma.event.create({
      data: {
        userId: user.id,
        date: new Date(date),
        title,
        note: note || null,
        notifyAt: notifyAt ? new Date(notifyAt) : null,
      }
    })
    return NextResponse.json(event, { status: 201 })
  } catch (e) {
    console.error('Event create error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



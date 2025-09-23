import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/calendar/summary?start=YYYY-MM-DD&end=YYYY-MM-DD
// Returns per-day counts and mood/season markers for the calendar grid
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')
    if (!start || !end) return NextResponse.json({ error: 'start and end required' }, { status: 400 })

    const startDate = new Date(start)
    const endDate = new Date(end)

    const thoughts = await prisma.thought.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: startDate, lte: endDate }
      },
      select: { id: true, createdAt: true, mood: true, season: true }
    })

    let events: Array<{ id: string; date: Date }> = []
    try {
      // prisma.event may be undefined during hot reload if client not regenerated
      // guard to avoid throwing
      // @ts-ignore
      if (prisma.event?.findMany) {
        // @ts-ignore
        events = await prisma.event.findMany({
          where: { userId: user.id, date: { gte: startDate, lte: endDate } },
          select: { id: true, date: true }
        })
      }
    } catch {}

    const dayKey = (d: Date) => d.toISOString().slice(0,10)
    const days: Record<string, { thoughts: number; moods: (string|null)[]; seasons: (string|null)[]; events: number }> = {}
    for (const t of thoughts) {
      const k = dayKey(t.createdAt as any)
      if (!days[k]) days[k] = { thoughts: 0, moods: [], seasons: [], events: 0 }
      days[k].thoughts++
      days[k].moods.push(t.mood ?? null)
      days[k].seasons.push(t.season ?? null)
    }
    for (const e of events) {
      const k = dayKey(e.date as any)
      if (!days[k]) days[k] = { thoughts: 0, moods: [], seasons: [], events: 0 }
      days[k].events++
    }

    return NextResponse.json({ days })
  } catch (e) {
    console.error('Calendar summary error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



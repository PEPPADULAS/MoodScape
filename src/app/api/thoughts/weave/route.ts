import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/thoughts/weave - Build narrative threads by shared tags across months
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const thoughts = await prisma.thought.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true, content: true, tags: true, createdAt: true, mood: true, season: true }
    })

    // Build tag -> entries map and month buckets
    const tagToEntries: Record<string, { id: string; title: string | null; createdAt: string; mood?: string | null; season?: string | null }[]> = {}
    const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    const monthBuckets: Record<string, string[]> = {}

    for (const t of thoughts) {
      const tags = t.tags ? (Array.isArray(t.tags) ? t.tags : JSON.parse(t.tags)) as string[] : []
      const entry = { id: t.id, title: t.title ?? null, createdAt: t.createdAt.toISOString(), mood: t.mood ?? null, season: t.season ?? null }
      const mk = monthKey(new Date(t.createdAt as any))
      monthBuckets[mk] = monthBuckets[mk] || []
      monthBuckets[mk].push(t.id)
      for (const tag of tags) {
        if (!tagToEntries[tag]) tagToEntries[tag] = []
        tagToEntries[tag].push(entry)
      }
    }

    // Threads are tags with >= 2 entries across >= 2 months
    const threads = Object.entries(tagToEntries)
      .map(([tag, entries]) => {
        const months = new Set(entries.map(e => monthKey(new Date(e.createdAt))))
        return { tag, entries, spanMonths: months.size }
      })
      .filter(t => t.entries.length >= 2 && t.spanMonths >= 1) // allow single-month too; UI can group
      .sort((a, b) => b.entries.length - a.entries.length)

    return NextResponse.json({ threads, months: Object.keys(monthBuckets).sort() })
  } catch (error) {
    console.error('Weave error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



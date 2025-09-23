import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { VISUAL_PACKS } from '@/lib/visual-packs'
import { AchievementService } from '@/lib/achievement-service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { thoughts: true, settings: true } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Build user stats to resolve unlocked packs
    const stats = AchievementService.calculateUserStats(user.thoughts as any, [])
    const unlocked = AchievementService.checkAchievements({ ...stats, achievements: [] }).map(a => a.id)

    // Optionally store an active pack in settings.themeMode or elsewhere; for now send catalog + unlocked ids
    return NextResponse.json({ packs: VISUAL_PACKS, unlockedAchievementIds: unlocked, active: user.settings?.activeVisualPack || null })
  } catch (e) {
    console.error('Visual packs GET error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/thoughts/analytics - Get thoughts analytics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Total thoughts count
    const totalThoughts = await prisma.thought.count({
      where: { userId: user.id }
    })

    // Thoughts by season
    const thoughtsBySeason = await prisma.thought.groupBy({
      by: ['season'],
      where: { userId: user.id },
      _count: true
    })

    // Thoughts by mood
    const thoughtsByMood = await prisma.thought.groupBy({
      by: ['mood'],
      where: { 
        userId: user.id,
        mood: {
          not: null
        }
      },
      _count: true
    })

    // Recent thoughts (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentThoughts = await prisma.thought.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    // Thoughts by month (last 12 months)
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const thoughtsByMonth = await prisma.thought.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: twelveMonthsAgo
        }
      },
      select: {
        createdAt: true
      }
    })

    // Group by month
    const monthlyStats = thoughtsByMonth.reduce((acc: Record<string, number>, thought: { createdAt: Date }) => {
      const month = thought.createdAt.toISOString().slice(0, 7) // YYYY-MM format
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})

    const analytics = {
      totalThoughts,
      recentThoughts,
      thoughtsBySeason: thoughtsBySeason.reduce((acc: Record<string, number>, item: { season: string | null; _count: number }) => {
        acc[item.season || 'unknown'] = item._count
        return acc
      }, {}),
      thoughtsByMood: thoughtsByMood.reduce((acc: Record<string, number>, item: { mood: string | null; _count: number }) => {
        acc[item.mood || 'unknown'] = item._count
        return acc
      }, {}),
      monthlyStats
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
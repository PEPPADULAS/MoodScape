import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSeasonFromDate } from '@/lib/utils'

// GET /api/thoughts - Fetch user's thoughts with optional filtering
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

    const { searchParams } = new URL(req.url)
    const season = searchParams.get('season')
    const mood = searchParams.get('mood')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = parseInt(searchParams.get('skip') || '0')

    const where: any = {
      userId: user.id
    }

    if (season) {
      where.season = season
    }

    if (mood) {
      where.mood = mood
    }

    const thoughts = await prisma.thought.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(thoughts)
  } catch (error) {
    console.error('Thoughts fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/thoughts - Create a new thought
export async function POST(req: NextRequest) {
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

    const { title, content, mood, weather, tags, isPrivate, font, language } = await req.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Auto-determine season based on current date, or set to rainy if weather is rainy
    let season = getSeasonFromDate(new Date())
    if (weather === 'rainy' || weather === 'stormy') {
      season = 'rainy'
    }

    // Load user defaults for font and language if not provided
    const settings = await prisma.userSettings.findUnique({ where: { userId: user.id } }) as any
    const resolvedFont = (font ?? undefined) || (settings?.defaultFont ?? undefined)
    const resolvedLanguage = (language ?? undefined) || (settings?.defaultLanguage ?? undefined)

    const data: any = {
      title,
      content,
      mood,
      weather,
      season,
      tags: tags ? JSON.stringify(tags) : null,
      isPrivate: isPrivate || false,
      userId: user.id,
      font: resolvedFont,
      language: resolvedLanguage
    }

    const thought = await prisma.thought.create({
      data,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(thought, { status: 201 })
  } catch (error) {
    console.error('Thought creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
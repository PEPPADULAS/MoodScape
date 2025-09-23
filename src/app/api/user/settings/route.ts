import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user.settings || { currentTheme: 'spring', autoTheme: true, themeMode: 'light', defaultFont: null, defaultLanguage: null })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
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

    const { currentTheme, autoTheme, themeMode, defaultFont, defaultLanguage } = await req.json()

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        ...(currentTheme && { currentTheme }),
        ...(autoTheme !== undefined && { autoTheme }),
        ...(themeMode && { themeMode }),
        ...(defaultFont !== undefined && { defaultFont }),
        ...(defaultLanguage !== undefined && { defaultLanguage })
      },
      create: {
        userId: user.id,
        currentTheme: currentTheme || 'spring',
        autoTheme: autoTheme !== undefined ? autoTheme : true,
        themeMode: themeMode || 'light',
        defaultFont: defaultFont || null,
        defaultLanguage: defaultLanguage || null
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
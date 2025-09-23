import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { packId } = await req.json()
    if (!packId) return NextResponse.json({ error: 'packId is required' }, { status: 400 })

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: { activeVisualPack: packId },
      create: { userId: user.id, currentTheme: 'spring', autoTheme: true, themeMode: 'light', activeVisualPack: packId }
    })
    return NextResponse.json(settings)
  } catch (e) {
    console.error('Activate pack error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



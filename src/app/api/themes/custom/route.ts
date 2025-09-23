import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/themes/custom
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const themes = await prisma.customTheme.findMany({ where: { userId: user.id }, orderBy: { updatedAt: 'desc' } })
    return NextResponse.json(themes)
  } catch (e) {
    console.error('Custom themes list error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/themes/custom
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { name, data } = await req.json()
    if (!name || !data) return NextResponse.json({ error: 'name and data required' }, { status: 400 })

    const created = await prisma.customTheme.create({ data: { userId: user.id, name, data: JSON.stringify(data) } })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error('Custom theme create error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



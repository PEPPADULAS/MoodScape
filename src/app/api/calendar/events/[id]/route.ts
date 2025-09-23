import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const existing = await prisma.event.findFirst({ where: { id, userId: user.id } })
    if (!existing) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    const { date, title, note, notifyAt } = await req.json()
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(date !== undefined && { date: new Date(date) }),
        ...(title !== undefined && { title }),
        ...(note !== undefined && { note }),
        ...(notifyAt !== undefined && { notifyAt: notifyAt ? new Date(notifyAt) : null }),
      }
    })
    return NextResponse.json(event)
  } catch (e) {
    console.error('Event update error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const existing = await prisma.event.findFirst({ where: { id, userId: user.id } })
    if (!existing) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    await prisma.event.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Event delete error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



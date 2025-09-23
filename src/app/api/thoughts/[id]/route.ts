import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/thoughts/[id] - Get a specific thought
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
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

    const thought = await prisma.thought.findFirst({
      where: {
        id: id,
        userId: user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!thought) {
      return NextResponse.json(
        { error: 'Thought not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(thought)
  } catch (error) {
    console.error('Thought fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/thoughts/[id] - Update a thought
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
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

    const { title, content, mood, weather, tags, isPrivate } = await req.json()

    const existingThought = await prisma.thought.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!existingThought) {
      return NextResponse.json(
        { error: 'Thought not found' },
        { status: 404 }
      )
    }

    const thought = await prisma.thought.update({
      where: { id: id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(mood !== undefined && { mood }),
        ...(weather !== undefined && { weather }),
        ...(tags !== undefined && { tags: tags ? JSON.stringify(tags) : null }),
        ...(isPrivate !== undefined && { isPrivate })
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(thought)
  } catch (error) {
    console.error('Thought update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/thoughts/[id] - Delete a thought
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
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

    const existingThought = await prisma.thought.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!existingThought) {
      return NextResponse.json(
        { error: 'Thought not found' },
        { status: 404 }
      )
    }

    await prisma.thought.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Thought deleted successfully' })
  } catch (error) {
    console.error('Thought deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
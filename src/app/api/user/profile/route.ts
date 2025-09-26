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

    console.log('Fetching profile for user:', session.user.email); // Debug log

    // Use raw SQL query to fetch user with bio field
    const users: any = await prisma.$queryRaw`
      SELECT id, name, email, image, bio
      FROM User
      WHERE email = ${session.user.email}
    `

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = users[0]
    console.log('User data fetched:', user); // Debug log

    return NextResponse.json({
      bio: user.bio || '',
      avatar: user.image || ''
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
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

    console.log('Updating profile for user:', session.user.email); // Debug log

    const { name, bio, avatar } = await req.json()
    console.log('Update data:', { name, bio, avatar }); // Debug log

    // Build update query
    let query = 'UPDATE User SET '
    const params: any[] = []
    let paramIndex = 1

    if (name !== undefined) {
      query += `"name" = $${paramIndex++}, `
      params.push(name)
    }

    if (bio !== undefined) {
      query += `"bio" = $${paramIndex++}, `
      params.push(bio)
    }

    if (avatar !== undefined) {
      query += `"image" = $${paramIndex++}, `
      params.push(avatar)
    }

    // Remove trailing comma and space
    query = query.slice(0, -2)
    query += ` WHERE email = $${paramIndex}`
    params.push(session.user.email)

    console.log('Executing query:', query, 'with params:', params); // Debug log

    // Execute update
    await prisma.$executeRawUnsafe(query, ...params)

    // Fetch updated user
    const updatedUsers: any = await prisma.$queryRaw`
      SELECT id, name, email, image, bio
      FROM User
      WHERE email = ${session.user.email}
    `

    if (!updatedUsers || updatedUsers.length === 0) {
      return NextResponse.json(
        { error: 'User not found after update' },
        { status: 404 }
      )
    }

    const updatedUser = updatedUsers[0]
    console.log('Profile updated successfully:', updatedUser); // Debug log

    return NextResponse.json({
      name: updatedUser.name,
      bio: updatedUser.bio,
      avatar: updatedUser.image
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
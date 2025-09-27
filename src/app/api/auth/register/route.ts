import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getCurrentSeason } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    console.log('Registration request received:', { name, email, password: password ? '***' : undefined })

    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Password hashed successfully')

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // This should work with the Prisma schema
        settings: {
          create: {
            currentTheme: getCurrentSeason(),
            autoTheme: true
          }
        }
      }
    })

    console.log('User created successfully:', user.id)

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
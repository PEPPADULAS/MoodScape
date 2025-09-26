import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

    // Check if user has a password (OAuth users might not)
    if (!user.password) {
      return NextResponse.json(
        { error: 'Cannot change password for OAuth accounts' },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = await req.json()
    console.log('Password change request for user:', session.user.email); // Debug log

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    console.log('Current password valid:', isPasswordValid); // Debug log
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    console.log('New password hashed'); // Debug log

    // Update password
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword }
    })
    console.log('Password updated in database'); // Debug log

    // Return success message without signing out
    // The frontend should handle redirecting the user to sign in again
    return NextResponse.json({ 
      message: 'Password changed successfully. Please sign in with your new password.',
      requiresReauth: true 
    })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
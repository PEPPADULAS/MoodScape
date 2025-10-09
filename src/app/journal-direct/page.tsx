'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { PageLoadingSpinner } from '@/components/loading/seasonal-loading'

export default function JournalDirect() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      router.push('/journal')
    }
  }, [status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <PageLoadingSpinner />
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Redirecting to your journal...
        </p>
      </div>
    </div>
  )
}
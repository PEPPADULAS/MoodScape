'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
          Welcome to <span className="text-purple-600">MoodScape</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          A beautiful mood-based journal for your thoughts and experiences
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/preview" 
            className="px-8 py-4 bg-purple-600 text-white rounded-full text-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
          >
            View Preview
          </Link>
          <Link 
            href="/auth/signin" 
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full text-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Mood Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300">Track your emotions and moods over time</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Personal Journal</h3>
            <p className="text-gray-600 dark:text-gray-300">Write and reflect on your daily experiences</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Reminders</h3>
            <p className="text-gray-600 dark:text-gray-300">Set reminders to maintain your journaling habit</p>
          </div>
        </div>
      </div>
    </div>
  )
}
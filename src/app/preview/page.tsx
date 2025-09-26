'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function PreviewPage() {
  const { data: session, status } = useSession()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const features = [
    { name: 'Journal', path: '/journal', description: 'Write and manage your thoughts' },
    { name: 'Dashboard', path: '/dashboard', description: 'View your mood analytics and insights' },
    { name: 'Reminders', path: '/reminders', description: 'Set and manage reminders' },
    { name: 'Music', path: '/music', description: 'Listen to mood-based music' },
    { name: 'Profile', path: '/profile', description: 'Manage your account and preferences' },
    { name: 'Settings', path: '/settings', description: 'Customize your experience' },
  ]

  const authLinks = [
    { name: 'Sign In', path: '/auth/signin' },
    { name: 'Sign Up', path: '/auth/signup' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="py-8 text-center">
          <motion.h1 
            className="text-5xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            MoodScape Preview
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Your Personal Mood-Based Journal Experience
          </motion.p>
          <motion.div 
            className="text-lg text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Current Time: {currentTime.toLocaleTimeString()}
          </motion.div>
        </header>

        {/* Authentication Status */}
        <motion.section 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Authentication Status</h2>
          {status === 'loading' ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : session ? (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <p className="text-gray-800 dark:text-white font-medium">Signed in as {session.user?.name || session.user?.email}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Ready to explore MoodScape</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Not signed in - Please sign in to access all features</p>
              <div className="flex space-x-4">
                {authLinks.map((link) => (
                  <Link 
                    key={link.path}
                    href={link.path}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {/* Main Features */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Main Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.path}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{feature.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                <Link 
                  href={feature.path}
                  className="inline-block px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Explore
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">12</div>
              <div className="text-gray-600 dark:text-gray-300">Entries</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-300">7</div>
              <div className="text-gray-600 dark:text-gray-300">Day Streak</div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">24</div>
              <div className="text-gray-600 dark:text-gray-300">Reminders</div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-300">85%</div>
              <div className="text-gray-600 dark:text-gray-300">Completion</div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="text-center py-8 text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <p>MoodScape - Your Personal Journal Experience</p>
          <p className="text-sm mt-2">© {new Date().getFullYear()} All rights reserved</p>
        </motion.footer>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { theme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('Sign in result:', result)

      if (result?.error) {
        setError('Invalid credentials. Please check your email and password.')
        console.error('Sign in error:', result.error)
      } else {
        // Get the session to ensure it's properly established
        const session = await getSession()
        console.log('Session after sign in:', session)
        // Use the callbackUrl parameter instead of direct router.push
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${theme.background} flex items-center justify-center p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl shadow-xl p-8 w-full max-w-md ${theme.card}`}
      >
        <div className="text-center mb-8">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-2xl">📝</span>
          </motion.div>
          <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>Welcome Back</h1>
          <p className={theme.accent}>Sign in to your MoodScape journal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${theme.text} mb-2`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${theme.text} mb-2`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 my-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${theme.button} text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={theme.accent}>
            Don't have an account?{' '}
            <Link href="/auth/signup" className={`font-medium hover:underline ${theme.text}`}>
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <Link href="/" className={`text-sm ${theme.accent} hover:underline`}>
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Sparkles, BookOpen, Music, Calendar, Palette, Brain, Heart, Star, CloudRain } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTheme, setSelectedTheme] = useState('spring')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const themes = [
    { 
      id: 'spring', 
      name: 'Spring Bloom', 
      description: 'Fresh beginnings and renewal',
      gradient: 'from-green-400 to-blue-500',
      icon: <Heart className="w-6 h-6" />
    },
    { 
      id: 'summer', 
      name: 'Summer Vibes', 
      description: 'Bright and energetic',
      gradient: 'from-yellow-400 to-red-500',
      icon: <Star className="w-6 h-6" />
    },
    { 
      id: 'fall', 
      name: 'Autumn Glow', 
      description: 'Warm and reflective',
      gradient: 'from-orange-500 to-red-600',
      icon: <Star className="w-6 h-6" />
    },
    { 
      id: 'winter', 
      name: 'Winter Peace', 
      description: 'Calm and introspective',
      gradient: 'from-blue-300 to-purple-500',
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 'rainy',
      name: 'Rainy Day',
      description: 'Cozy and contemplative',
      gradient: 'from-slate-400 to-blue-600',
      icon: <CloudRain className="w-6 h-6" />
    }
  ]

  const features = [
    { 
      name: 'Mood Journal', 
      description: 'Express your thoughts with contextual mood tracking',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'Music Therapy', 
      description: 'Create playlists that match your moods and seasons',
      icon: <Music className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Smart Calendar', 
      description: 'Track your journey with seasonal themes and reminders',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-green-500 to-teal-500'
    },
    { 
      name: 'Theme Studio', 
      description: 'Customize your writing experience with beautiful themes',
      icon: <Palette className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500'
    }
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading your MoodScape...</p>
        </div>
      </div>
    )
  }

  // Redirect authenticated users to dashboard
  if (status === 'authenticated') {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400 to-green-400 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Mood<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Scape</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                A beautiful mood-based journal for your thoughts, experiences, and personal growth
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link 
                href="/auth/signup" 
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started
              </Link>
              <Link 
                href="/auth/signin" 
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full text-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-500 dark:text-gray-400"
            >
              Current Time: {currentTime.toLocaleTimeString()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Mood Theme
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select a theme that resonates with your current mood and personality
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {themes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 cursor-pointer transition-all ${
                selectedTheme === theme.id 
                  ? 'border-purple-500 ring-2 ring-purple-500/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${theme.gradient} flex items-center justify-center mb-4`}>
                {theme.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{theme.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{theme.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need for a meaningful journaling experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <BookOpen className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have discovered the power of mood-based journaling
            </p>
            <Link 
              href="/auth/signup" 
              className="inline-block px-8 py-4 bg-white text-purple-600 rounded-full text-lg font-medium hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Your Account
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} MoodScape. All rights reserved.</p>
      </footer>
    </div>
  )
}
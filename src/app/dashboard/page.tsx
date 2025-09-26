'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, LogOut, Search, Filter, Music2, Info, Bell, Home, Calendar, Palette, BookOpen } from 'lucide-react'
import { SmoothNavigation } from '@/components/navigation/smooth-navigation'
import { useTheme } from '@/contexts/theme-context'
import { useSettings } from '@/contexts/settings-context'
import ThemeSelector from '@/components/theme-selector'
import ThoughtCard from '@/components/thought-card'
import CreateThoughtModal from '@/components/create-thought-modal'
import EnhancedSearchFilter from '@/components/enhanced-search-filter'
import { LoadingWrapper, ThoughtCardSkeleton } from '@/components/loading/loading-wrapper'
import { PageLoadingSpinner } from '@/components/loading/seasonal-loading'
import { ParallaxContainer, ScrollTriggeredAnimation, StaggeredAnimation, ScrollProgressIndicator } from '@/components/animations/parallax-container'
import { PageTransition, TextReveal, EnhancedButton } from '@/components/animations/micro-interactions'
import { DynamicBackground, SeasonalGradientBackground, ConstellationEffect } from '@/components/backgrounds/dynamic-background'
import { EnhancedThemeControls } from '@/components/theme/enhanced-theme-controls'
import { MusicPlayer } from '@/components/music/music-player'
import { MusicVisualizer } from '@/components/music/music-visualizer'
import { QueueManager, useKeyboardShortcuts, KeyboardShortcutsHelp } from '@/components/music/queue-manager'
import { ThemedInput, ThemedSelect } from '@/components/ui/themed-input'
import { MobileEnhancements } from '@/components/mobile/mobile-enhancements'
import { AccessibilityControls } from '@/components/accessibility/accessibility-controls'
import { ThemedCalendar } from '@/components/charts/themed-calendar'
import { DashboardThemeSection } from '@/components/theme/dashboard-theme-section'
// Personalization components
import { WeeklyWords } from '@/components/personalization/weekly-words'
import { DailyQuote } from '@/components/personalization/daily-quote'
import { WritingPrompt } from '@/components/personalization/writing-prompt'

interface Thought {
  id: string
  title?: string
  content: string
  mood?: string
  weather?: string
  season?: string
  tags?: string
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, currentTheme, customGradient } = useTheme()
  const { weeklyWordsEnabled, dailyQuotesEnabled } = useSettings()
  
  // Apply custom gradient if it exists
  useEffect(() => {
    if (customGradient) {
      const root = document.documentElement
      root.style.setProperty('background', customGradient)
      document.body.style.background = customGradient
    }
  }, [customGradient])

  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [filteredThoughts, setFilteredThoughts] = useState<Thought[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showAccessibilityControls, setShowAccessibilityControls] = useState(false)

  // Initialize keyboard shortcuts for music player
  useKeyboardShortcuts();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchThoughts()
    }
  }, [session])

  const fetchThoughts = async () => {
    try {
      const response = await fetch('/api/thoughts')
      if (response.ok) {
        const data = await response.json()
        setThoughts(data)
      }
    } catch (error) {
      console.error('Failed to fetch thoughts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleThoughtCreated = (newThought: Thought) => {
    setThoughts(prev => [newThought, ...prev])
    setIsCreateModalOpen(false)
  }

  const handleThoughtDeleted = (thoughtId: string) => {
    setThoughts(prev => prev.filter(t => t.id !== thoughtId))
  }

  const handleRefresh = async () => {
    setLoading(true)
    await fetchThoughts()
  }

  const handleThoughtUpdated = (updatedThought: Thought) => {
    setThoughts(prev => prev.map(t => t.id === updatedThought.id ? updatedThought : t))
  }

  const handleFilteredThoughts = (filtered: Thought[]) => {
    setFilteredThoughts(filtered)
  }

  if (status === 'loading' || !session) {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <PageLoadingSpinner />
      </div>
    )
  }

  return (
    <MobileEnhancements
      onRefresh={handleRefresh}
      enableSwipeGestures={true}
      enablePullToRefresh={true}
      enableHapticFeedback={true}
    >
      <PageTransition>
      <div className={`min-h-screen ${theme.background} relative`}>
        {/* Scroll Progress Indicator */}
        <ScrollProgressIndicator />
        
        {/* Dynamic Background Layers */}
        <SeasonalGradientBackground />
        {/* <DynamicBackground intensity="medium" /> */}
        <ConstellationEffect />
        
        {/* Parallax Background Layer */}
        <ParallaxContainer speed={0.3} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 blur-3xl animate-pulse" />
            <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-red-600 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-40 left-1/3 w-40 h-40 rounded-full bg-gradient-to-br from-green-400 to-blue-600 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </ParallaxContainer>
      {/* Header */}
      <header className={`border-b ${theme.card.includes('border') ? theme.card.split(' ').find(c => c.includes('border')) : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{theme.emoji}</span>
              <h1 className={`text-xl font-bold ${theme.text}`}>MoodScape</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeSelector />
              <SmoothNavigation onSignOut={() => signOut()} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personalization Section */}
        <ScrollTriggeredAnimation animation="fadeInUp" delay={0.2}>
          <div className={`${theme.card} rounded-2xl p-6 mb-8 backdrop-blur-sm border`}>
            <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>Personalized For You</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Theme Words */}
              {weeklyWordsEnabled && (
                <div className="lg:col-span-1">
                  <h4 className={`font-medium ${theme.text} mb-3`}>This Week's Themes</h4>
                  <WeeklyWords />
                </div>
              )}
              
              {/* Daily Quote */}
              {dailyQuotesEnabled && (
                <div className={`${weeklyWordsEnabled ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                  <h4 className={`font-medium ${theme.text} mb-3`}>Quote of the Day</h4>
                  <DailyQuote />
                </div>
              )}
            </div>
          </div>
        </ScrollTriggeredAnimation>
        
        {/* Custom Theme Section */}
        <ScrollTriggeredAnimation animation="fadeInUp" delay={0.4}>
          <div className="mb-8" data-theme-studio>
            <div className="relative">
              <DashboardThemeSection />
              {/* Theme Studio Button positioned near the theme section */}
              <div className="absolute top-4 right-4">
                <EnhancedThemeControls />
              </div>
            </div>
          </div>
        </ScrollTriggeredAnimation>
        
        {/* Welcome Message */}
        <ScrollTriggeredAnimation animation="fadeInUp" delay={0.6}>
          <div className={`${theme.card} rounded-2xl p-8 mb-8 backdrop-blur-sm border`}>
            <div className="text-center">
              <h2 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                Welcome to Your MoodScape Dashboard
              </h2>
              <p className={`${theme.accent} text-lg mb-6 max-w-2xl mx-auto`}>
                This is your personalized dashboard. For detailed analytics, thought management, 
                and other journaling features, please visit the My Journal section.
              </p>
              <EnhancedButton
                onClick={() => router.push('/journal')}
                variant="primary"
                size="lg"
                className="flex items-center space-x-2 mx-auto"
              >
                <span>Go to My Journal</span>
              </EnhancedButton>
            </div>
          </div>
        </ScrollTriggeredAnimation>

        {/* Quick Actions */}
        <ScrollTriggeredAnimation animation="fadeInUp" delay={0.8}>
          <div className={`${theme.card} rounded-2xl p-6 mb-8 backdrop-blur-sm border`}>
            <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className={`${theme.card} rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border`}
                whileHover={{ y: -5 }}
                onClick={() => router.push('/journal')}
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className={`w-6 h-6 ${theme.text}`} />
                  <div>
                    <h4 className={`font-medium ${theme.text}`}>My Journal</h4>
                    <p className={`text-sm ${theme.accent}`}>Write and manage your thoughts</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className={`${theme.card} rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border`}
                whileHover={{ y: -5 }}
                onClick={() => router.push('/reminders')}
              >
                <div className="flex items-center space-x-3">
                  <Bell className={`w-6 h-6 ${theme.text}`} />
                  <div>
                    <h4 className={`font-medium ${theme.text}`}>Reminders</h4>
                    <p className={`text-sm ${theme.accent}`}>Manage your important dates</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className={`${theme.card} rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border`}
                whileHover={{ y: -5 }}
                onClick={() => router.push('/music')}
              >
                <div className="flex items-center space-x-3">
                  <Music2 className={`w-6 h-6 ${theme.text}`} />
                  <div>
                    <h4 className={`font-medium ${theme.text}`}>Music</h4>
                    <p className={`text-sm ${theme.accent}`}>Listen to your favorite tracks</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollTriggeredAnimation>
      </main>

      {/* Music System Components */}
      <MusicPlayer />
      <MusicVisualizer />
      <QueueManager />
      <KeyboardShortcutsHelp />
      
      {/* Accessibility Controls */}
      <AccessibilityControls
        isVisible={showAccessibilityControls}
        onToggle={() => setShowAccessibilityControls(!showAccessibilityControls)}
      />
    </div>
    </PageTransition>
    </MobileEnhancements>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, LogOut, Search, Filter, Music2, Info, Bell, Home, Calendar, Palette } from 'lucide-react'
import { SmoothNavigation } from '@/components/navigation/smooth-navigation'
import { useTheme } from '@/contexts/theme-context'
import ThemeSelector from '@/components/theme-selector'
import ThoughtCard from '@/components/thought-card'
import CreateThoughtModal from '@/components/create-thought-modal'
import AnalyticsDashboard from '@/components/analytics-dashboard'
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
import { ThemedClock } from '@/components/charts/themed-clock'
import { DashboardThemeSection } from '@/components/theme/dashboard-theme-section'

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
  const { theme } = useTheme()
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
        
        {/* Clock Widget */}
        <div className="fixed right-4 top-4 z-40">
          <ThemedClock style="digital" />
        </div>
        
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
        {/* Calendar + Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 order-last lg:order-first">
            <ThemedCalendar />
          </div>
          <div className="lg:col-span-2">
            {/* Analytics Dashboard */}
            <ScrollTriggeredAnimation animation="fadeInUp" delay={0.2}>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-0">
                <div className="lg:col-span-1">
                  <AnalyticsDashboard />
                </div>
              </div>
            </ScrollTriggeredAnimation>
          </div>
        </div>

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
        
        {/* Enhanced Search & Filter */}
        <ScrollTriggeredAnimation animation="fadeInUp" delay={0.6}>
          <div className="mb-8">
            <EnhancedSearchFilter
              thoughts={thoughts}
              onFilteredThoughts={handleFilteredThoughts}
            />
          </div>
        </ScrollTriggeredAnimation>

        {/* New Thought Button */}
        <div className="flex justify-center mb-8">
          <EnhancedButton
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
            size="lg"
            className="flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Thought</span>
          </EnhancedButton>
        </div>

        {/* Thoughts Grid */}
        <LoadingWrapper
          isLoading={loading}
          loadingText="Gathering your thoughts..."
          size="lg"
        >
          {filteredThoughts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">{theme.emoji}</div>
              <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>
                {thoughts.length === 0 ? 'Start Your Journey' : 'No thoughts found'}
              </h3>
              <p className={`${theme.accent} mb-6`}>
                {thoughts.length === 0 
                  ? 'Create your first thought to begin your seasonal journal.'
                  : 'Try adjusting your search or filters to find what you\'re looking for.'}
              </p>
              {thoughts.length === 0 && (
                <EnhancedButton
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="primary"
                  size="lg"
                >
                  Create Your First Thought
                </EnhancedButton>
              )}
            </motion.div>
          ) : (
            <ScrollTriggeredAnimation animation="fadeInUp" delay={0.4}>
              <StaggeredAnimation staggerDelay={0.1}>
                <div className="grid grid-cols-1 gap-6">
                  {filteredThoughts.map((thought, index) => (
                    <motion.div 
                      key={thought.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ThoughtCard
                        thought={thought}
                        onDelete={handleThoughtDeleted}
                        onUpdate={handleThoughtUpdated}
                      />
                    </motion.div>
                  ))}
                </div>
              </StaggeredAnimation>
            </ScrollTriggeredAnimation>
          )}
        </LoadingWrapper>
      </main>

      {/* Create Thought Modal */}
      <CreateThoughtModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onThoughtCreated={handleThoughtCreated}
      />
      
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
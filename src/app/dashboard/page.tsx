'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, LogOut, Search, Filter, Music2, Info } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import ThemeSelector from '@/components/theme-selector'
import ThoughtCard from '@/components/thought-card'
import CreateThoughtModal from '@/components/create-thought-modal'
import AnalyticsDashboard from '@/components/analytics-dashboard'
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
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSeason, setSelectedSeason] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
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
  }, [session, selectedSeason, selectedMood])

  const fetchThoughts = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedSeason) params.append('season', selectedSeason)
      if (selectedMood) params.append('mood', selectedMood)

      const response = await fetch(`/api/thoughts?${params}`)
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

  const filteredThoughts = thoughts.filter(thought =>
    thought.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thought.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        
        {/* Enhanced Theme Controls */}
        <EnhancedThemeControls />
        
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
              <button
                onClick={() => router.push('/about')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${theme.text} hover:opacity-75 transition-opacity`}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>
              <button
                onClick={() => router.push('/music')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${theme.text} hover:opacity-75 transition-opacity`}
              >
                <Music2 className="w-4 h-4" />
                <span>Music</span>
              </button>
              <button
                onClick={() => signOut()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${theme.text} hover:opacity-75 transition-opacity`}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <ScrollTriggeredAnimation animation="fadeInUp" className="mb-8 relative z-10">
          <div className="mb-8">
            <TextReveal 
              className={`text-3xl font-bold ${theme.text} mb-2`}
            >
              {`Welcome back, ${session.user?.name || 'Friend'}!`}
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className={theme.accent}
            >
              Capture your thoughts and experiences in this beautiful mood-based journal.
            </motion.p>
          </div>
        </ScrollTriggeredAnimation>

        {/* Analytics Dashboard */}
        <ScrollTriggeredAnimation animation="fadeInUp" delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
            <div className="lg:col-span-1">
              <AnalyticsDashboard />
            </div>
          </div>
        </ScrollTriggeredAnimation>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.accent}`} />
              <ThemedInput
                type="text"
                placeholder="Search your thoughts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <ThemedSelect
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-4 py-2"
            >
              <option value="">All Seasons</option>
              <option value="spring">🌸 Spring</option>
              <option value="summer">☀️ Summer</option>
              <option value="fall">🍂 Fall</option>
              <option value="winter">❄️ Winter</option>
              <option value="rainy">🌧️ Rainy</option>
            </ThemedSelect>
            
            <ThemedSelect
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="px-4 py-2"
            >
              <option value="">All Moods</option>
              <option value="happy">😊 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="excited">🤩 Excited</option>
              <option value="calm">😌 Calm</option>
              <option value="anxious">😰 Anxious</option>
              <option value="grateful">🙏 Grateful</option>
            </ThemedSelect>
            
            <EnhancedButton
              onClick={() => setIsCreateModalOpen(true)}
              variant="primary"
              size="md"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Thought</span>
            </EnhancedButton>
          </div>
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
                  : 'Try adjusting your search or filters.'}
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
                {filteredThoughts.map((thought, index) => (
                  <div key={thought.id} className="mb-6">
                    <ThoughtCard
                      thought={thought}
                      onDelete={handleThoughtDeleted}
                      onUpdate={handleThoughtUpdated}
                    />
                  </div>
                ))}
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
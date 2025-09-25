'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  PenTool, 
  BookOpen, 
  Search, 
  BarChart3, 
  Calendar,
  Heart,
  Star,
  Clock,
  TrendingUp,
  FileText,
  Sparkles
} from 'lucide-react'
import { SmoothNavigation } from '@/components/navigation/smooth-navigation'
import { useTheme } from '@/contexts/theme-context'
import ThemeSelector from '@/components/theme-selector'
import ThoughtCard from '@/components/thought-card'
import CreateThoughtModal from '@/components/create-thought-modal'
import EnhancedSearchFilter from '@/components/enhanced-search-filter'
import AnalyticsDashboard from '@/components/analytics-dashboard'
import { LoadingWrapper } from '@/components/loading/loading-wrapper'
import { PageLoadingSpinner } from '@/components/loading/seasonal-loading'
import { ParallaxContainer, ScrollTriggeredAnimation, StaggeredAnimation, ScrollProgressIndicator } from '@/components/animations/parallax-container'
import { PageTransition, TextReveal, EnhancedButton } from '@/components/animations/micro-interactions'
import { DynamicBackground, SeasonalGradientBackground, ConstellationEffect } from '@/components/backgrounds/dynamic-background'
import { ThemedInput, ThemedTextarea } from '@/components/ui/themed-input'
import { MobileEnhancements } from '@/components/mobile/mobile-enhancements'
import { ThemedCalendar } from '@/components/charts/themed-calendar'
import { ThemedClock } from '@/components/charts/themed-clock'

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

export default function JournalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme } = useTheme()
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [filteredThoughts, setFilteredThoughts] = useState<Thought[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showQuickWrite, setShowQuickWrite] = useState(false)
  const [quickWriteContent, setQuickWriteContent] = useState('')
  const [quickWriteMood, setQuickWriteMood] = useState('')
  const [activeTab, setActiveTab] = useState<'write' | 'browse' | 'analytics'>('write')

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
    setShowQuickWrite(false)
    setQuickWriteContent('')
    setQuickWriteMood('')
  }

  const handleThoughtDeleted = (thoughtId: string) => {
    setThoughts(prev => prev.filter(t => t.id !== thoughtId))
  }

  const handleThoughtUpdated = (updatedThought: Thought) => {
    setThoughts(prev => prev.map(t => t.id === updatedThought.id ? updatedThought : t))
  }

  const handleFilteredThoughts = (filtered: Thought[]) => {
    setFilteredThoughts(filtered)
  }

  const handleQuickWrite = async () => {
    if (!quickWriteContent.trim()) return

    try {
      const response = await fetch('/api/thoughts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: quickWriteContent,
          mood: quickWriteMood || null,
          isPrivate: false,
        }),
      })

      if (response.ok) {
        const newThought = await response.json()
        handleThoughtCreated(newThought)
      }
    } catch (error) {
      console.error('Failed to create quick thought:', error)
    }
  }

  const getJournalStats = () => {
    const totalThoughts = thoughts.length
    const thisWeek = thoughts.filter(t => {
      const thoughtDate = new Date(t.createdAt)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return thoughtDate > weekAgo
    }).length
    const thisMonth = thoughts.filter(t => {
      const thoughtDate = new Date(t.createdAt)
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return thoughtDate > monthAgo
    }).length
    
    return { totalThoughts, thisWeek, thisMonth }
  }

  const stats = getJournalStats()

  if (status === 'loading' || !session) {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <PageLoadingSpinner />
      </div>
    )
  }

  return (
    <MobileEnhancements
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
                  <span className="text-3xl">📖</span>
                  <h1 className={`text-xl font-bold ${theme.text}`}>My Journal</h1>
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
            
            {/* Journal Stats Cards */}
            <ScrollTriggeredAnimation animation="fadeInUp" delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  className={`${theme.card} rounded-xl p-6 shadow-lg backdrop-blur-sm`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${theme.accent} mb-1`}>Total Thoughts</p>
                      <p className={`text-3xl font-bold ${theme.text}`}>{stats.totalThoughts}</p>
                    </div>
                    <FileText className={`w-8 h-8 ${theme.accent}`} />
                  </div>
                </motion.div>

                <motion.div
                  className={`${theme.card} rounded-xl p-6 shadow-lg backdrop-blur-sm`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${theme.accent} mb-1`}>This Week</p>
                      <p className={`text-3xl font-bold ${theme.text}`}>{stats.thisWeek}</p>
                    </div>
                    <TrendingUp className={`w-8 h-8 ${theme.accent}`} />
                  </div>
                </motion.div>

                <motion.div
                  className={`${theme.card} rounded-xl p-6 shadow-lg backdrop-blur-sm`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${theme.accent} mb-1`}>This Month</p>
                      <p className={`text-3xl font-bold ${theme.text}`}>{stats.thisMonth}</p>
                    </div>
                    <Calendar className={`w-8 h-8 ${theme.accent}`} />
                  </div>
                </motion.div>
              </div>
            </ScrollTriggeredAnimation>

            {/* Tab Navigation */}
            <ScrollTriggeredAnimation animation="fadeInUp" delay={0.2}>
              <div className="flex justify-center mb-8">
                <div className={`${theme.card} rounded-xl p-2 shadow-lg backdrop-blur-sm`}>
                  <div className="flex space-x-2">
                    {[
                      { id: 'write', label: 'Write', icon: PenTool },
                      { id: 'browse', label: 'Browse', icon: BookOpen },
                      { id: 'analytics', label: 'Insights', icon: BarChart3 }
                    ].map((tab) => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? `${theme.button} text-white shadow-lg`
                            : `${theme.text} hover:bg-gray-100`
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span className="font-medium">{tab.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollTriggeredAnimation>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'write' && (
                <motion.div
                  key="write"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Quick Write Section */}
                  <ScrollTriggeredAnimation animation="fadeInUp" delay={0.3}>
                    <div className={`${theme.card} rounded-xl p-8 shadow-lg backdrop-blur-sm mb-8`}>
                      <div className="text-center mb-6">
                        <motion.div
                          className="text-6xl mb-4"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          ✍️
                        </motion.div>
                        <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>
                          What's on your mind today?
                        </h2>
                        <p className={`${theme.accent}`}>
                          Start writing your thoughts, feelings, or experiences
                        </p>
                      </div>

                      {/* Quick Write Form */}
                      <div className="max-w-2xl mx-auto space-y-4">
                        <ThemedTextarea
                          placeholder="Begin your journal entry... What made you smile today? What are you grateful for? How are you feeling?"
                          value={quickWriteContent}
                          onChange={(e) => setQuickWriteContent(e.target.value)}
                          rows={6}
                          className="resize-none"
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <select
                              value={quickWriteMood}
                              onChange={(e) => setQuickWriteMood(e.target.value)}
                              className={`px-4 py-2 rounded-lg border ${theme.mode === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                            >
                              <option value="">How are you feeling?</option>
                              <option value="happy">😊 Happy</option>
                              <option value="sad">😢 Sad</option>
                              <option value="excited">🤩 Excited</option>
                              <option value="calm">😌 Calm</option>
                              <option value="anxious">😰 Anxious</option>
                              <option value="grateful">🙏 Grateful</option>
                            </select>
                          </div>
                          
                          <div className="flex space-x-3">
                            <EnhancedButton
                              onClick={() => setIsCreateModalOpen(true)}
                              variant="secondary"
                              size="md"
                              className="flex items-center space-x-2"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>Advanced</span>
                            </EnhancedButton>
                            
                            <EnhancedButton
                              onClick={handleQuickWrite}
                              variant="primary"
                              size="md"
                              className="flex items-center space-x-2"
                              disabled={!quickWriteContent.trim()}
                            >
                              <Plus className="w-4 h-4" />
                              <span>Save Thought</span>
                            </EnhancedButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollTriggeredAnimation>

                  {/* Recent Thoughts Preview */}
                  {thoughts.length > 0 && (
                    <ScrollTriggeredAnimation animation="fadeInUp" delay={0.4}>
                      <div className={`${theme.card} rounded-xl p-6 shadow-lg backdrop-blur-sm`}>
                        <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
                          <Clock className="w-5 h-5 mr-2" />
                          Recent Thoughts
                        </h3>
                        <div className="space-y-4">
                          {thoughts.slice(0, 3).map((thought, index) => (
                            <motion.div
                              key={thought.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border-l-4 border-blue-500 pl-4 py-2"
                            >
                              <p className={`${theme.text} text-sm line-clamp-2`}>
                                {thought.content.substring(0, 100)}...
                              </p>
                              <p className={`${theme.accent} text-xs mt-1`}>
                                {new Date(thought.createdAt).toLocaleDateString()}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <EnhancedButton
                            onClick={() => setActiveTab('browse')}
                            variant="secondary"
                            size="sm"
                          >
                            View All Thoughts
                          </EnhancedButton>
                        </div>
                      </div>
                    </ScrollTriggeredAnimation>
                  )}
                </motion.div>
              )}

              {activeTab === 'browse' && (
                <motion.div
                  key="browse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Enhanced Search & Filter */}
                  <div className="mb-8">
                    <EnhancedSearchFilter
                      thoughts={thoughts}
                      onFilteredThoughts={handleFilteredThoughts}
                    />
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
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>
                          {thoughts.length === 0 ? 'Start Your Journal Journey' : 'No thoughts found'}
                        </h3>
                        <p className={`${theme.accent} mb-6`}>
                          {thoughts.length === 0 
                            ? 'Create your first thought to begin your personal journal.'
                            : 'Try adjusting your search or filters to find what you\'re looking for.'}
                        </p>
                        {thoughts.length === 0 && (
                          <EnhancedButton
                            onClick={() => setActiveTab('write')}
                            variant="primary"
                            size="lg"
                          >
                            Write Your First Thought
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
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ScrollTriggeredAnimation animation="fadeInUp" delay={0.3}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1">
                        <ThemedCalendar />
                      </div>
                      <div className="lg:col-span-2">
                        <AnalyticsDashboard />
                      </div>
                    </div>
                  </ScrollTriggeredAnimation>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Create Thought Modal */}
          <CreateThoughtModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onThoughtCreated={handleThoughtCreated}
          />
        </div>
      </PageTransition>
    </MobileEnhancements>
  )
}

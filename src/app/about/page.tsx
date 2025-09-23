'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Heart, 
  Music, 
  Palette, 
  Brain, 
  Users, 
  Shield, 
  Sparkles,
  Github,
  Mail,
  Star,
  BookOpen,
  Headphones,
  Camera,
  Zap
} from 'lucide-react'
import { PageTransition, TextReveal, EnhancedButton } from '@/components/animations/micro-interactions'
import { ParallaxContainer, ScrollTriggeredAnimation, StaggeredAnimation } from '@/components/animations/parallax-container'
import { DynamicBackground, SeasonalGradientBackground, ConstellationEffect } from '@/components/backgrounds/dynamic-background'

export default function AboutPage() {
  const { theme } = useTheme()
  const router = useRouter()

  const features = [
    {
      icon: Heart,
      title: "Mood-Based Journaling",
      description: "Express your thoughts with contextual mood tracking that adapts to your emotional journey.",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: Music,
      title: "Immersive Music System",
      description: "Create playlists that match your mood and season, with local file support and smart recommendations.",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Palette,
      title: "Dynamic Themes",
      description: "Beautiful seasonal themes that change based on time, weather, and your personal preferences.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Brain,
      title: "Smart Analytics",
      description: "Gain insights into your thoughts and moods with interactive charts and personal growth tracking.",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: Users,
      title: "Accessibility First",
      description: "Built with comprehensive accessibility features including screen reader support and customizable interfaces.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your thoughts are private by default with secure authentication and optional sharing controls.",
      color: "from-indigo-500 to-purple-500"
    }
  ]

  const technologies = [
    { name: "Next.js 15", description: "Modern React framework with Turbopack" },
    { name: "TypeScript", description: "Type-safe development experience" },
    { name: "Framer Motion", description: "Smooth animations and micro-interactions" },
    { name: "Tailwind CSS", description: "Utility-first styling with custom themes" },
    { name: "NextAuth.js", description: "Secure authentication system" },
    { name: "Web Audio API", description: "Advanced music playback and visualization" }
  ]

  return (
    <PageTransition>
      <div className={`min-h-screen ${theme.background} relative overflow-hidden`}>
        {/* Background Elements */}
        <SeasonalGradientBackground />
        {/* <DynamicBackground intensity="medium" /> */}
        <ConstellationEffect />
        
        {/* Parallax Background */}
        <ParallaxContainer speed={0.3} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 blur-3xl animate-pulse" />
            <div className="absolute top-60 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-red-600 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-40 left-1/3 w-48 h-48 rounded-full bg-gradient-to-br from-green-400 to-blue-600 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </ParallaxContainer>

        {/* Header */}
        <header className={`border-b ${theme.card.includes('border') ? theme.card.split(' ').find(c => c.includes('border')) : 'border-gray-200'} relative z-10`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <EnhancedButton
                  onClick={() => router.back()}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </EnhancedButton>
                <span className="text-3xl">{theme.emoji}</span>
                <h1 className={`text-xl font-bold ${theme.text}`}>About MoodScape</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          {/* Hero Section */}
          <ScrollTriggeredAnimation animation="fadeInUp" className="text-center mb-16">
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-6"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              
              <TextReveal className={`text-4xl md:text-5xl font-bold ${theme.text} mb-6`}>
                Welcome to MoodScape
              </TextReveal>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className={`text-xl ${theme.accent} max-w-3xl mx-auto leading-relaxed`}
              >
                A revolutionary mood-based journaling platform that combines the art of self-reflection 
                with immersive music experiences and beautiful seasonal themes. Capture your thoughts, 
                track your emotions, and create soundscapes that match your inner world.
              </motion.p>
            </div>
          </ScrollTriggeredAnimation>

          {/* Mission Statement */}
          <ScrollTriggeredAnimation animation="fadeInUp" delay={0.2} className="mb-16">
            <div className={`${theme.card} rounded-2xl p-8 mb-8`}>
              <div className="text-center">
                <BookOpen className={`w-8 h-8 ${theme.text} mx-auto mb-4`} />
                <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>Our Mission</h2>
                <p className={`${theme.accent} text-lg leading-relaxed`}>
                  We believe that everyone deserves a beautiful, private space to explore their thoughts and emotions. 
                  MoodScape combines cutting-edge technology with thoughtful design to create an experience that's 
                  both functional and inspiring—helping you understand yourself better through the seasons of life.
                </p>
              </div>
            </div>
          </ScrollTriggeredAnimation>

          {/* Features Grid */}
          <ScrollTriggeredAnimation animation="fadeInUp" delay={0.3} className="mb-16">
            <h2 className={`text-3xl font-bold ${theme.text} text-center mb-12`}>What Makes MoodScape Special</h2>
            <StaggeredAnimation staggerDelay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      className={`${theme.card} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>{feature.title}</h3>
                      <p className={`${theme.accent} text-sm leading-relaxed`}>{feature.description}</p>
                    </motion.div>
                  )
                })}
              </div>
            </StaggeredAnimation>
          </ScrollTriggeredAnimation>

          {/* How It Works */}
          <ScrollTriggeredAnimation animation="fadeInUp" delay={0.4} className="mb-16">
            <h2 className={`text-3xl font-bold ${theme.text} text-center mb-12`}>How It Works</h2>
            <div className="space-y-8">
              <StaggeredAnimation staggerDelay={0.2}>
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>Express Your Thoughts</h3>
                    <p className={`${theme.accent} leading-relaxed`}>
                      Write down your thoughts, feelings, and experiences. Tag them with your current mood, 
                      the season, and any other context that feels meaningful.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>Create Your Soundtrack</h3>
                    <p className={`${theme.accent} leading-relaxed`}>
                      Build playlists from your own music library that match your moods and seasons. 
                      Let the music enhance your journaling experience with immersive soundscapes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>Discover Patterns</h3>
                    <p className={`${theme.accent} leading-relaxed`}>
                      Use our analytics dashboard to discover patterns in your thoughts and emotions. 
                      Track your growth, celebrate achievements, and gain insights into your personal journey.
                    </p>
                  </div>
                </div>
              </StaggeredAnimation>
            </div>
          </ScrollTriggeredAnimation>

          {/* Technology Stack */}
          <ScrollTriggeredAnimation animation="fadeInUp" delay={0.5} className="mb-16">
            <h2 className={`text-3xl font-bold ${theme.text} text-center mb-12`}>Built with Modern Technology</h2>
            <div className={`${theme.card} rounded-2xl p-8`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    className="flex items-center space-x-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div>
                      <h4 className={`font-semibold ${theme.text}`}>{tech.name}</h4>
                      <p className={`text-sm ${theme.accent}`}>{tech.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollTriggeredAnimation>

          {/* Values Section */}
          <ScrollTriggeredAnimation animation="fadeInUp" delay={0.6} className="mb-16">
            <h2 className={`text-3xl font-bold ${theme.text} text-center mb-12`}>Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className={`w-12 h-12 ${theme.text} mx-auto mb-4`} />
                <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>Privacy First</h3>
                <p className={`${theme.accent} text-sm`}>Your thoughts are yours alone. We never sell your data or share your personal content.</p>
              </div>
              <div className="text-center">
                <Heart className={`w-12 h-12 ${theme.text} mx-auto mb-4`} />
                <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>Inclusive Design</h3>
                <p className={`${theme.accent} text-sm`}>Built for everyone with comprehensive accessibility features and thoughtful user experience.</p>
              </div>
              <div className="text-center">
                <Zap className={`w-12 h-12 ${theme.text} mx-auto mb-4`} />
                <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>Continuous Innovation</h3>
                <p className={`${theme.accent} text-sm`}>We're constantly improving and adding new features based on user feedback and emerging technologies.</p>
              </div>
            </div>
          </ScrollTriggeredAnimation>

          {/* Call to Action */}
          <ScrollTriggeredAnimation animation="fadeInUp" delay={0.7} className="text-center">
            <div className={`${theme.card} rounded-2xl p-8`}>
              <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>Ready to Begin Your Journey?</h2>
              <p className={`${theme.accent} mb-8 max-w-2xl mx-auto`}>
                Join thousands of users who have discovered the power of mood-based journaling. 
                Start capturing your thoughts, creating your soundscapes, and understanding yourself better today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <EnhancedButton
                  onClick={() => router.push('/dashboard')}
                  variant="primary"
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Start Journaling</span>
                </EnhancedButton>
                <EnhancedButton
                  onClick={() => router.push('/music')}
                  variant="secondary"
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <Headphones className="w-5 h-5" />
                  <span>Explore Music</span>
                </EnhancedButton>
              </div>
            </div>
          </ScrollTriggeredAnimation>
        </main>
      </div>
    </PageTransition>
  )
}
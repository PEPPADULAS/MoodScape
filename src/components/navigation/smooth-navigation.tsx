'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'
import { useRouter, usePathname } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Bell, 
  Info, 
  Music2, 
  LogOut,
  Menu,
  X,
  BookOpen
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const navItems: NavItem[] = [
  {
    id: 'journal',
    label: 'My Journal',
    path: '/journal',
    icon: BookOpen,
    color: 'blue'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    color: 'gray'
  },
  {
    id: 'reminders',
    label: 'Reminders',
    path: '/reminders',
    icon: Bell,
    color: 'orange'
  },
  {
    id: 'music',
    label: 'Music',
    path: '/music',
    icon: Music2,
    color: 'purple'
  },
  {
    id: 'about',
    label: 'About',
    path: '/about',
    icon: Info,
    color: 'green'
  }
]

interface SmoothNavigationProps {
  onSignOut: () => void
}

export function SmoothNavigation({ onSignOut }: SmoothNavigationProps) {
  const { theme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Find current page index
  useEffect(() => {
    const currentItemIndex = navItems.findIndex(item => item.path === pathname)
    if (currentItemIndex !== -1) {
      setCurrentIndex(currentItemIndex)
    }
  }, [pathname])

  const navigateToIndex = (index: number) => {
    if (index >= 0 && index < navItems.length) {
      setCurrentIndex(index)
      router.push(navItems[index].path)
    }
  }

  const navigatePrevious = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : navItems.length - 1
    navigateToIndex(prevIndex)
  }

  const navigateNext = () => {
    const nextIndex = currentIndex < navItems.length - 1 ? currentIndex + 1 : 0
    navigateToIndex(nextIndex)
  }

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = isActive 
      ? 'bg-opacity-20 border-opacity-50' 
      : 'bg-opacity-10 border-opacity-30 hover:bg-opacity-15'
    
    switch (color) {
      case 'blue':
        return `${baseClasses} ${isActive ? 'bg-blue-500 border-blue-500' : 'bg-blue-500 border-blue-500'}`
      case 'orange':
        return `${baseClasses} ${isActive ? 'bg-orange-500 border-orange-500' : 'bg-orange-500 border-orange-500'}`
      case 'purple':
        return `${baseClasses} ${isActive ? 'bg-purple-500 border-purple-500' : 'bg-purple-500 border-purple-500'}`
      case 'green':
        return `${baseClasses} ${isActive ? 'bg-green-500 border-green-500' : 'bg-green-500 border-green-500'}`
      default:
        return `${baseClasses} ${isActive ? 'bg-gray-500 border-gray-500' : 'bg-gray-500 border-gray-500'}`
    }
  }

  const currentItem = navItems[currentIndex]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-2">
        {/* Previous Arrow */}
        <motion.button
          onClick={navigatePrevious}
          className={`p-2 rounded-lg border transition-all duration-200 ${getColorClasses('gray', false)}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={`Previous: ${navItems[currentIndex > 0 ? currentIndex - 1 : navItems.length - 1].label}`}
        >
          <ChevronLeft className={`w-4 h-4 ${theme.text}`} />
        </motion.button>

        {/* Current Page Display */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`flex items-center space-x-3 px-4 py-2 rounded-lg border transition-all duration-200 ${getColorClasses(currentItem.color, true)}`}
        >
          <currentItem.icon className={`w-5 h-5 ${theme.text}`} />
          <span className={`font-medium ${theme.text}`}>{currentItem.label}</span>
        </motion.div>

        {/* Next Arrow */}
        <motion.button
          onClick={navigateNext}
          className={`p-2 rounded-lg border transition-all duration-200 ${getColorClasses('gray', false)}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={`Next: ${navItems[currentIndex < navItems.length - 1 ? currentIndex + 1 : 0].label}`}
        >
          <ChevronRight className={`w-4 h-4 ${theme.text}`} />
        </motion.button>

        {/* Sign Out Button */}
        <motion.button
          onClick={onSignOut}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
            theme.mode === 'light'
              ? 'bg-red-100 hover:bg-red-200 border-red-300 text-red-700'
              : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:inline">Sign Out</span>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center space-x-2">
        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-2 rounded-lg border transition-all duration-200 ${getColorClasses('gray', false)}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? (
            <X className={`w-5 h-5 ${theme.text}`} />
          ) : (
            <Menu className={`w-5 h-5 ${theme.text}`} />
          )}
        </motion.button>

        {/* Current Page (Mobile) */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${getColorClasses(currentItem.color, true)}`}
        >
          <currentItem.icon className={`w-4 h-4 ${theme.text}`} />
          <span className={`font-medium text-sm ${theme.text}`}>{currentItem.label}</span>
        </motion.div>

        {/* Sign Out Button (Mobile) */}
        <motion.button
          onClick={onSignOut}
          className={`p-2 rounded-lg border transition-all duration-200 ${
            theme.mode === 'light'
              ? 'bg-red-100 hover:bg-red-200 border-red-300 text-red-700'
              : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`absolute top-0 left-0 h-full w-80 ${theme.card} shadow-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className={`text-xl font-bold ${theme.text}`}>Navigation</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-2 rounded-lg ${theme.surface} hover:opacity-75`}
                  >
                    <X className={`w-5 h-5 ${theme.text}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        navigateToIndex(index)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg border transition-all duration-200 ${getColorClasses(item.color, index === currentIndex)}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className={`w-5 h-5 ${theme.text}`} />
                      <span className={`font-medium ${theme.text}`}>{item.label}</span>
                      {index === currentIndex && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 bg-green-500 rounded-full"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Navigation Controls */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <motion.button
                      onClick={navigatePrevious}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${getColorClasses('gray', false)}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className={`w-4 h-4 ${theme.text}`} />
                      <span className={theme.text}>Previous</span>
                    </motion.button>

                    <motion.button
                      onClick={navigateNext}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${getColorClasses('gray', false)}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={theme.text}>Next</span>
                      <ChevronRight className={`w-4 h-4 ${theme.text}`} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

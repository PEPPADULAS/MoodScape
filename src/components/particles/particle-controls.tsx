'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Settings, X } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'

interface ParticleControlsProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  particleCount: number
  onParticleCountChange: (count: number) => void
}

export default function ParticleControls({ 
  enabled, 
  onToggle, 
  particleCount, 
  onParticleCountChange 
}: ParticleControlsProps) {
  const { theme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onToggle(!enabled)}
        className={`
          mb-2 p-3 rounded-full backdrop-blur-sm border transition-all duration-300
          ${enabled 
            ? `${theme.button} text-white shadow-lg` 
            : 'bg-white/20 text-gray-600 border-white/30 hover:bg-white/30'
          }
        `}
        title={enabled ? 'Disable Particles' : 'Enable Particles'}
      >
        <Sparkles className={`w-5 h-5 ${enabled ? 'animate-pulse' : ''}`} />
      </motion.button>

      {/* Settings Button */}
      {enabled && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          className="mb-2 p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-gray-600 transition-all duration-300"
          title="Particle Settings"
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      )}

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && enabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`absolute bottom-20 right-0 w-64 ${theme.card} rounded-lg p-4 shadow-xl border`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-medium ${theme.text}`}>Particle Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-1 rounded-md hover:bg-gray-100 ${theme.text}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Particle Count */}
              <div>
                <label className={`block text-xs font-medium ${theme.text} mb-2`}>
                  Particle Count: {particleCount}
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={particleCount}
                  onChange={(e) => onParticleCountChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Few</span>
                  <span>Many</span>
                </div>
              </div>

              {/* Performance Info */}
              <div className="text-xs text-gray-500">
                <p>💡 Tip: Reduce particles on slower devices</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
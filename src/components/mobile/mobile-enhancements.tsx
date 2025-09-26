'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { RefreshCw, Vibrate, Sun, Moon, Type, Contrast, Volume2 } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useSettings } from '@/contexts/settings-context';

interface MobileEnhancementsProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  enableSwipeGestures?: boolean;
  enablePullToRefresh?: boolean;
  enableHapticFeedback?: boolean;
}

export function MobileEnhancements({
  children,
  onRefresh,
  enableSwipeGestures = true,
  enablePullToRefresh = true,
  enableHapticFeedback = true
}: MobileEnhancementsProps) {
  const { theme, toggleMode, themeMode } = useTheme();
  const { 
    fontSize: contextFontSize, 
    setFontSize: setContextFontSize,
    highContrastMode, 
    setHighContrastMode,
    reducedMotion, 
    setReducedMotion
  } = useSettings();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pull-to-refresh motion values
  const y = useMotionValue(0);
  const refreshProgress = useTransform(y, [0, 100], [0, 1]);

  // Haptic feedback function
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHapticFeedback) return;
    
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Auto dark mode based on system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only handle auto theme switching if user has auto theme enabled
      // This would be implemented based on user preferences
      console.log('System theme preference changed:', e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setReducedMotion]);

  // Handle pull-to-refresh
  const handlePullToRefresh = async () => {
    if (y.get() > 80 && !isRefreshing) {
      setIsRefreshing(true);
      triggerHaptic('medium');
      
      try {
        await onRefresh?.();
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          y.set(0);
        }, 1000);
      }
    }
  };

  // Swipe gesture handlers
  const handleSwipeLeft = () => {
    triggerHaptic('light');
    // Add navigation logic here
  };

  const handleSwipeRight = () => {
    triggerHaptic('light');
    // Add navigation logic here
  };

  const handlePanEnd = (event: PointerEvent, info: PanInfo) => {
    if (!enableSwipeGestures) return;
    
    const threshold = 100;
    const velocity = Math.abs(info.velocity.x);
    
    if (velocity > 500 && Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    }
    
    if (enablePullToRefresh && info.offset.y > 0) {
      handlePullToRefresh();
    } else {
      y.set(0);
    }
  };

  // Font size adjustment
  const adjustFontSize = (increment: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + increment));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    // Map the numeric font size to the settings context values
    if (newSize <= 14) {
      setContextFontSize('small');
    } else if (newSize >= 18) {
      setContextFontSize('large');
    } else {
      setContextFontSize('medium');
    }
    triggerHaptic('light');
  };

  // Sync font size with settings context
  useEffect(() => {
    const sizeMap = {
      'small': 14,
      'medium': 16,
      'large': 18
    };
    setFontSize(sizeMap[contextFontSize]);
  }, [contextFontSize]);

  // Toggle high contrast
  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    setHighContrastMode(!highContrastMode);
    document.documentElement.classList.toggle('high-contrast', !highContrast);
    triggerHaptic('medium');
  };

  // Sync high contrast state with settings context
  useEffect(() => {
    setHighContrast(highContrastMode);
  }, [highContrastMode]);

  // Auto theme toggle
  const toggleAutoTheme = () => {
    // Toggle between light and dark modes
    toggleMode();
    triggerHaptic('medium');
  };

  return (
    <div className="relative overflow-hidden">
      {/* Mobile Accessibility Panel */}
      <motion.div
        className={`fixed bottom-4 left-4 z-40 ${
          theme.mode === 'light' 
            ? 'bg-white/95 border-gray-200 text-gray-900' 
            : 'bg-black/90 border-white/20 text-white'
        } backdrop-blur-md rounded-2xl border p-4 shadow-lg md:hidden`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          {/* Font Size Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustFontSize(-2)}
              className={`p-2 rounded-lg transition-colors ${
                theme.mode === 'light'
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              aria-label="Decrease font size"
            >
              <Type className="w-3 h-3" />
            </button>
            <span className="text-xs font-medium">{fontSize}px</span>
            <button
              onClick={() => adjustFontSize(2)}
              className={`p-2 rounded-lg transition-colors ${
                theme.mode === 'light'
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              aria-label="Increase font size"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`p-2 rounded-lg transition-colors ${
              highContrast
                ? 'bg-yellow-500 text-black'
                : theme.mode === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            aria-label="Toggle high contrast"
          >
            <Contrast className="w-4 h-4" />
          </button>

          {/* Auto Theme Toggle */}
          <button
            onClick={toggleAutoTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme.mode === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            aria-label={`Theme: ${theme.mode}`}
          >
            {theme.mode === 'light' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Haptic Feedback Toggle */}
          <button
            onClick={() => triggerHaptic('heavy')}
            className={`p-2 rounded-lg transition-colors ${
              enableHapticFeedback
                ? theme.mode === 'light'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-blue-500/30 text-blue-300'
                : theme.mode === 'light'
                ? 'bg-gray-100 text-gray-400'
                : 'bg-white/10 text-white/40'
            }`}
            aria-label="Test haptic feedback"
          >
            <Vibrate className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Pull-to-refresh indicator */}
      {enablePullToRefresh && (
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30"
          style={{ y: useTransform(y, [0, 100], [-50, 0]) }}
        >
          <motion.div
            className={`p-3 rounded-full backdrop-blur-md ${
              theme.mode === 'light'
                ? 'bg-white/90 border-gray-200'
                : 'bg-black/90 border-white/20'
            } border shadow-lg`}
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
          >
            <RefreshCw className={`w-5 h-5 ${
              theme.mode === 'light' ? 'text-gray-700' : 'text-white'
            }`} />
          </motion.div>
        </motion.div>
      )}

      {/* Main content with gesture handling */}
      <motion.div
        ref={containerRef}
        style={{ y: enablePullToRefresh ? y : 0 }}
        drag={enableSwipeGestures || enablePullToRefresh ? 'y' : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.2, bottom: 0 }}
        onPanEnd={handlePanEnd}
        className={`min-h-screen ${
          reducedMotion ? '[&_*]:!transition-none [&_*]:!animation-none' : ''
        } ${highContrastMode ? 'high-contrast' : ''}`}
      >
        {children}
      </motion.div>

      {/* Responsive Typography CSS */}
      <style jsx global>{`
        .high-contrast {
          filter: contrast(150%) brightness(120%);
        }
        
        .high-contrast * {
          border-color: currentColor !important;
        }
        
        /* Responsive Typography */
        @media (max-width: 640px) {
          h1 { font-size: 1.8rem; line-height: 1.2; }
          h2 { font-size: 1.5rem; line-height: 1.3; }
          h3 { font-size: 1.3rem; line-height: 1.4; }
          h4 { font-size: 1.1rem; line-height: 1.4; }
          p { font-size: 0.95rem; line-height: 1.6; }
          
          /* Ensure minimum touch targets */
          button, [role="button"], input, select, textarea {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Improve spacing on mobile */
          .mobile-spacing {
            padding: 1rem;
            gap: 0.75rem;
          }
        }
        
        @media (max-width: 480px) {
          h1 { font-size: 1.6rem; }
          h2 { font-size: 1.4rem; }
          h3 { font-size: 1.2rem; }
          p { font-size: 0.9rem; }
        }
        
        /* Focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid ${theme.mode === 'light' ? '#3b82f6' : '#60a5fa'};
          outline-offset: 2px;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

// Hook for mobile detection
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Hook for touch device detection
export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

// Hook for haptic feedback
export function useHapticFeedback() {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  return { triggerHaptic };
}
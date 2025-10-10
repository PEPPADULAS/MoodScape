'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Palette, 
  Accessibility, 
  Keyboard, 
  Sparkles,
  LogOut,
  Save,
  X
} from 'lucide-react';
import { SmoothNavigation } from '@/components/navigation/smooth-navigation';
import { useTheme } from '@/contexts/theme-context';

import { PageLoadingSpinner } from '@/components/loading/seasonal-loading';
import { PageTransition } from '@/components/animations/micro-interactions';
import { DynamicBackground, SeasonalGradientBackground, ConstellationEffect } from '@/components/backgrounds/dynamic-background';
import { ThemedClock } from '@/components/charts/themed-clock';
import ThemeSettings from '@/components/settings/theme-settings';
import PersonalizationSettings from '@/components/settings/personalization-settings';
import AccessibilitySettings from '@/components/settings/accessibility-settings';
import KeyboardSettings from '@/components/settings/keyboard-settings';
import { useSettings } from '@/contexts/settings-context';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, customGradient } = useTheme();
  const { 
    keyboardNavEnabled,
    weeklyWordsEnabled,
    dailyQuotesEnabled,
    writingPromptsEnabled
  } = useSettings();
  
  // Apply custom gradient if it exists
  useEffect(() => {
    if (customGradient) {
      const root = document.documentElement;
      root.style.setProperty('background', customGradient);
      document.body.style.background = customGradient;
    }
  }, [customGradient]);

  const [activeTab, setActiveTab] = useState<'theme' | 'personalization' | 'accessibility' | 'keyboard'>('theme');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <PageLoadingSpinner />
      </div>
    );
  }

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate saving process
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      // Reset success message after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 500);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const confirmSignOut = () => {
    signOut();
  };

  const cancelSignOut = () => {
    setShowSignOutConfirm(false);
  };

  // Adjust styling based on theme mode - 80% opacity for light mode
  const getContainerClasses = () => {
    if (theme.mode === 'light') {
      return `bg-white/80 backdrop-blur-sm relative`;
    }
    return `${theme.background} relative`;
  };

  const getHeaderClasses = () => {
    if (theme.mode === 'light') {
      return "border-b border-gray-300 bg-white/80 backdrop-blur-sm";
    }
    return `border-b ${theme.card.includes('border') ? theme.card.split(' ').find(c => c.includes('border')) : 'border-gray-200'}`;
  };

  const getBackButtonClasses = () => {
    if (theme.mode === 'light') {
      return "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-100 text-gray-700";
    }
    return `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-700 text-white`;
  };

  const getSidebarClasses = () => {
    if (theme.mode === 'light') {
      return `bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-300`;
    }
    return `${theme.card} rounded-2xl p-6 backdrop-blur-sm border`;
  };

  const getMainContentClasses = () => {
    if (theme.mode === 'light') {
      return `bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-300`;
    }
    return `${theme.card} rounded-2xl p-6 backdrop-blur-sm border`;
  };

  const getSaveButtonClasses = () => {
    if (theme.mode === 'light') {
      return `flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
        isSaving
          ? 'bg-gray-300 cursor-not-allowed'
          : `${theme.button} text-white shadow-lg hover:shadow-xl`
      }`;
    }
    return `flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
      isSaving
        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
        : `${theme.button} text-white shadow-lg hover:shadow-xl`
    }`;
  };

  const getSaveSuccessClasses = () => {
    if (theme.mode === 'light') {
      return "mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-center";
    }
    return "mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-center";
  };

  const getTitleClasses = () => {
    if (theme.mode === 'light') {
      return "text-xl font-bold text-gray-900";
    }
    return `text-xl font-bold ${theme.text}`;
  };

  const getTextClasses = () => {
    if (theme.mode === 'light') {
      return "text-gray-700";
    }
    return theme.text;
  };

  const getSubtleTextClasses = () => {
    if (theme.mode === 'light') {
      return "text-gray-600";
    }
    return theme.accent;
  };

  const getSignOutButtonClasses = () => {
    if (theme.mode === 'light') {
      return "flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 border border-red-300 text-red-700 transition-all";
    }
    return `flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all`;
  };

  const getConfirmModalClasses = () => {
    if (theme.mode === 'light') {
      return "bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-300";
    }
    return `${theme.card} rounded-2xl p-6 w-full max-w-md shadow-2xl border`;
  };

  const getConfirmButtonClasses = () => {
    if (theme.mode === 'light') {
      return "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors";
    }
    return "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors";
  };

  const getCancelButtonClasses = () => {
    if (theme.mode === 'light') {
      return "px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors";
    }
    return "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors";
  };

  return (
    <PageTransition>
      <div className={`min-h-screen ${getContainerClasses()}`}>
        {/* Dynamic Background Layers */}
        <SeasonalGradientBackground />
        <ConstellationEffect />
        
        {/* Header */}
        <header className={getHeaderClasses()}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleGoBack}
                  className={getBackButtonClasses()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back</span>
                </motion.button>
                <span className="text-3xl">⚙️</span>
                <h1 className={getTitleClasses()}>Settings</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <SmoothNavigation onSignOut={handleSignOut} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className={getSidebarClasses()}>
                <h2 className={getTitleClasses().replace('text-xl', 'text-lg') + ' mb-4'}>Settings</h2>
                <nav className="space-y-2">
                  {[
                    { id: 'theme', label: 'Theme', icon: Palette },
                    { id: 'personalization', label: 'Personalization', icon: Sparkles },
                    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
                    { id: 'keyboard', label: 'Keyboard', icon: Keyboard }
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeTab === item.id
                          ? `${theme.button} text-white shadow-lg`
                          : `${theme.mode === 'light' ? 'text-gray-900 hover:bg-gray-100' : `${theme.text} hover:bg-gray-100 dark:hover:bg-gray-700`}`
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </nav>
                
                {/* Sign Out Button */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    onClick={handleSignOut}
                    className={getSignOutButtonClasses()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Main Settings Content */}
            <div className="lg:w-3/4">
              <div className={getMainContentClasses()}>
                {/* Tab Content */}
                {activeTab === 'theme' && <ThemeSettings />}
                {activeTab === 'personalization' && <PersonalizationSettings />}
                {activeTab === 'accessibility' && <AccessibilitySettings />}
                {activeTab === 'keyboard' && <KeyboardSettings />}
                
                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <motion.button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className={getSaveButtonClasses()}
                    whileHover={!isSaving ? { scale: 1.05 } : {}}
                    whileTap={!isSaving ? { scale: 0.95 } : {}}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </motion.button>
                </div>
                
                {/* Save Success Message */}
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={getSaveSuccessClasses()}
                  >
                    Settings saved successfully!
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>
        
        {/* Sign Out Confirmation Modal */}
        <AnimatePresence>
          {showSignOutConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={cancelSignOut}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={getConfirmModalClasses()}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={`text-lg font-bold mb-4 ${theme.mode === 'light' ? 'text-gray-900' : theme.text}`}>
                  Confirm Sign Out
                </h3>
                <p className={`mb-6 ${theme.mode === 'light' ? 'text-gray-700' : theme.text}`}>
                  Are you sure you want to sign out? You'll need to log back in to access your account.
                </p>
                <div className="flex justify-end space-x-3">
                  <motion.button
                    onClick={cancelSignOut}
                    className={getCancelButtonClasses()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={confirmSignOut}
                    className={getConfirmButtonClasses()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Out
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
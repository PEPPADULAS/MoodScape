'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Music, Headphones, Heart, Settings, Info } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useMusic } from '@/contexts/music-context';
import { PageLoadingSpinner } from '@/components/loading/seasonal-loading';
import { PlaylistManager } from '@/components/music/playlist-manager';
import { MusicPlayer } from '@/components/music/music-player';
import { MusicVisualizer } from '@/components/music/music-visualizer';
import { QueueManager, useKeyboardShortcuts, KeyboardShortcutsHelp } from '@/components/music/queue-manager';
import { PageTransition } from '@/components/animations/micro-interactions';
import { ScrollTriggeredAnimation } from '@/components/animations/parallax-container';

export default function MusicPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const music = useMusic();
  const [activeTab, setActiveTab] = useState<'playlists' | 'library' | 'recent'>('playlists');

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  if (status === 'loading') {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <PageLoadingSpinner />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <PageTransition>
      <div className={`min-h-screen ${theme.background}`}>
        {/* Header */}
        <header className={`border-b ${theme.card.includes('border') ? theme.card.split(' ').find(c => c.includes('border')) : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => router.push('/dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${theme.text} hover:opacity-75 transition-opacity`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </motion.button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className={`text-xl font-bold ${theme.text}`}>Music Library</h1>
                    <p className={`text-sm ${theme.accent}`}>Organize your musical journey</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => router.push('/about')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${theme.text} hover:opacity-75 transition-opacity`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Info className="w-4 h-4" />
                  <span>About</span>
                </motion.button>
                
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${theme.card}`}>
                  <Headphones className="w-4 h-4 text-purple-500" />
                  <span className={`text-sm ${theme.text}`}>
                    {music.playlists.length} Playlist{music.playlists.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <ScrollTriggeredAnimation animation="fadeInUp" className="mb-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center"
              >
                <Music className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className={`text-3xl font-bold ${theme.text} mb-2`}>
                Your Musical Sanctuary
              </h2>
              <p className={`text-lg ${theme.accent} max-w-2xl mx-auto`}>
                Create mood-based playlists, enjoy seamless playback, and let music enhance your journaling experience with seasonal themes and immersive visualizations.
              </p>
            </div>
          </ScrollTriggeredAnimation>

          {/* Stats Cards */}
          <ScrollTriggeredAnimation animation="fadeInUp" delay={0.2} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                className={`${theme.card} rounded-xl p-6 text-center`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-purple-500" />
                </div>
                <div className={`text-2xl font-bold ${theme.text}`}>{music.playlists.length}</div>
                <div className={`text-sm ${theme.accent}`}>Playlists</div>
              </motion.div>

              <motion.div
                className={`${theme.card} rounded-xl p-6 text-center`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-blue-500" />
                </div>
                <div className={`text-2xl font-bold ${theme.text}`}>
                  {music.playlists.reduce((total, playlist) => total + playlist.tracks.length, 0)}
                </div>
                <div className={`text-sm ${theme.accent}`}>Total Tracks</div>
              </motion.div>

              <motion.div
                className={`${theme.card} rounded-xl p-6 text-center`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-500" />
                </div>
                <div className={`text-2xl font-bold ${theme.text}`}>
                  {music.playlists.filter(p => p.mood).length}
                </div>
                <div className={`text-sm ${theme.accent}`}>Mood Playlists</div>
              </motion.div>

              <motion.div
                className={`${theme.card} rounded-xl p-6 text-center`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-orange-500" />
                </div>
                <div className={`text-2xl font-bold ${theme.text}`}>
                  {music.recentlyPlayed.length}
                </div>
                <div className={`text-sm ${theme.accent}`}>Recently Played</div>
              </motion.div>
            </div>
          </ScrollTriggeredAnimation>

          {/* Tab Navigation */}
          <ScrollTriggeredAnimation animation="fadeInUp" delay={0.3} className="mb-8">
            <div className="flex justify-center">
              <div className={`inline-flex ${theme.card} rounded-xl p-1`}>
                {[
                  { id: 'playlists', label: 'Playlists', icon: Music },
                  { id: 'library', label: 'Library', icon: Headphones },
                  { id: 'recent', label: 'Recent', icon: Heart }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : `${theme.text} hover:bg-white/5`
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </ScrollTriggeredAnimation>

          {/* Tab Content */}
          <ScrollTriggeredAnimation animation="fadeInUp" delay={0.4}>
            <div className="min-h-[600px]">
              {activeTab === 'playlists' && (
                <PlaylistManager />
              )}
              
              {activeTab === 'library' && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Headphones className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold ${theme.text} mb-2`}>Music Library</h3>
                  <p className={`${theme.accent} mb-6 max-w-md mx-auto`}>
                    Browse all your imported tracks, organize by albums, artists, and create new playlists from your collection.
                  </p>
                  <p className={`text-sm ${theme.accent}`}>
                    Feature coming soon - Your tracks will be automatically organized here.
                  </p>
                </div>
              )}
              
              {activeTab === 'recent' && (
                <div className="space-y-6">
                  <h3 className={`text-2xl font-bold ${theme.text}`}>Recently Played</h3>
                  {music.recentlyPlayed.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h4 className={`text-xl font-semibold ${theme.text} mb-2`}>No recent tracks</h4>
                      <p className={`${theme.accent}`}>
                        Start playing music to see your recent tracks here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {music.recentlyPlayed.slice(0, 12).map((track, index) => (
                        <motion.div
                          key={`${track.id}-${index}`}
                          className={`${theme.card} rounded-lg p-4 hover:shadow-lg transition-all duration-200`}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => music.play(track)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                              <Music className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium ${theme.text} truncate`}>
                                {track.title}
                              </h4>
                              <p className={`text-sm ${theme.accent} truncate`}>
                                {track.artist || 'Unknown Artist'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollTriggeredAnimation>
        </main>

        {/* Music System Components */}
        <MusicPlayer />
        <MusicVisualizer />
        <QueueManager />
        <KeyboardShortcutsHelp />
      </div>
    </PageTransition>
  );
}
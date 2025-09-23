'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  Trash2, 
  GripVertical, 
  SkipForward, 
  Shuffle,
  RotateCcw
} from 'lucide-react';
import { useMusic, Track } from '@/contexts/music-context';
import { useTheme } from '@/contexts/theme-context';
import { cn } from '@/lib/utils';

interface QueueManagerProps {
  className?: string;
}

export function QueueManager({ className }: QueueManagerProps) {
  const music = useMusic();
  const { theme } = useTheme();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTrackClick = (track: Track) => {
    music.play(track);
  };

  const handleRemoveFromQueue = (index: number) => {
    music.removeFromQueue(index);
  };

  if (!music.showQueue) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className={cn(
          "fixed top-4 right-4 bottom-20 w-80 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 z-40 flex flex-col",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-semibold">Queue</h3>
            <p className="text-white/60 text-sm">{music.queue.length} tracks</p>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={music.shuffleQueue}
              disabled={music.queue.length < 2}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shuffle className="w-4 h-4 text-white/60" />
            </motion.button>
            <motion.button
              onClick={music.clearQueue}
              disabled={music.queue.length === 0}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </motion.button>
            <motion.button
              onClick={music.toggleQueue}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4 text-white/60" />
            </motion.button>
          </div>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto">
          {music.queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <SkipForward className="w-8 h-8 text-white/40" />
              </div>
              <h4 className="text-white/60 font-medium mb-2">Queue is empty</h4>
              <p className="text-white/40 text-sm">Add songs to your queue to see them here</p>
            </div>
          ) : (
            <div className="p-2">
              {music.queue.map((track, index) => {
                const isCurrentTrack = music.currentTrack?.id === track.id;
                
                return (
                  <motion.div
                    key={`${track.id}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "group flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200",
                      isCurrentTrack && "bg-blue-500/20 border border-blue-500/30"
                    )}
                  >
                    {/* Drag Handle */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                      <GripVertical className="w-4 h-4 text-white/40" />
                    </div>

                    {/* Track Number */}
                    <div className="w-6 text-center">
                      {isCurrentTrack && music.isPlaying ? (
                        <div className="flex justify-center">
                          <div className="flex gap-0.5">
                            <div className="w-0.5 h-4 bg-blue-400 rounded-full animate-pulse" />
                            <div className="w-0.5 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-0.5 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      ) : (
                        <span className={cn(
                          "text-sm",
                          isCurrentTrack ? "text-blue-300 font-medium" : "text-white/40"
                        )}>
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Track Info */}
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleTrackClick(track)}
                    >
                      <h4 className={cn(
                        "font-medium truncate",
                        isCurrentTrack ? "text-blue-300" : "text-white"
                      )}>
                        {track.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-white/60 text-sm truncate">
                          {track.artist || 'Unknown Artist'}
                        </p>
                        <span className="text-white/40 text-xs">
                          {formatTime(track.duration)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        onClick={() => handleTrackClick(track)}
                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isCurrentTrack && music.isPlaying ? (
                          <Pause className="w-4 h-4 text-white/80" />
                        ) : (
                          <Play className="w-4 h-4 text-white/80" />
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => handleRemoveFromQueue(index)}
                        className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Queue Actions */}
        {music.queue.length > 0 && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>
                Total: {formatTime(music.queue.reduce((total, track) => total + track.duration, 0))}
              </span>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => {
                    // Play next song in queue
                    if (music.queue.length > 0) {
                      const currentIndex = music.queue.findIndex(track => track.id === music.currentTrack?.id);
                      const nextIndex = currentIndex + 1;
                      if (nextIndex < music.queue.length) {
                        music.play(music.queue[nextIndex]);
                      }
                    }
                  }}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play all
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Keyboard shortcuts hook
export function useKeyboardShortcuts() {
  const music = useMusic();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (music.isPlaying) {
            music.pause();
          } else {
            music.play();
          }
          break;
        
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            music.next();
          }
          break;
        
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            music.previous();
          }
          break;
        
        case 'ArrowUp':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            music.setVolume(Math.min(1, music.volume + 0.1));
          }
          break;
        
        case 'ArrowDown':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            music.setVolume(Math.max(0, music.volume - 0.1));
          }
          break;
        
        case 'KeyM':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            music.toggleMute();
          }
          break;
        
        case 'KeyS':
          if (e.ctrlKey || e.metaKey && e.shiftKey) {
            e.preventDefault();
            music.toggleShuffle();
          }
          break;
        
        case 'KeyQ':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            music.toggleQueue();
          }
          break;
        
        case 'KeyV':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            music.toggleVisualizer();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [music]);
}

// Keyboard shortcuts display component
export function KeyboardShortcutsHelp() {
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts = [
    { key: 'Space', description: 'Play/Pause' },
    { key: 'Ctrl + →', description: 'Next track' },
    { key: 'Ctrl + ←', description: 'Previous track' },
    { key: 'Ctrl + ↑', description: 'Volume up' },
    { key: 'Ctrl + ↓', description: 'Volume down' },
    { key: 'Ctrl + M', description: 'Mute/Unmute' },
    { key: 'Ctrl + Shift + S', description: 'Toggle shuffle' },
    { key: 'Ctrl + Q', description: 'Toggle queue' },
    { key: 'Ctrl + V', description: 'Toggle visualizer' }
  ];

  return (
    <>
      <motion.button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 left-4 p-3 bg-black/80 backdrop-blur-md rounded-full text-white/60 hover:text-white transition-colors z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm font-mono">?</span>
      </motion.button>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Keyboard Shortcuts</h3>
                <motion.button
                  onClick={() => setShowHelp(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-white/60" />
                </motion.button>
              </div>

              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white/80">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white/60 text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
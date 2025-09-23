'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat, 
  Repeat1,
  List,
  Music,
  Upload,
  Minimize2,
  Maximize2,
  BarChart3,
  Heart,
  Plus
} from 'lucide-react';
import { useMusic } from '@/contexts/music-context';
import { useTheme } from '@/contexts/theme-context';
import { cn } from '@/lib/utils';

export function MusicPlayer() {
  const music = useMusic();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      if (file.type.startsWith('audio/')) {
        try {
          const track = await music.addTrack(file);
          music.addToQueue(track);
          
          // If no track is playing, start playing this one
          if (!music.currentTrack) {
            music.play(track);
          }
        } catch (error) {
          console.error('Error adding track:', error);
        }
      }
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Progress bar component
  const ProgressBar = () => {
    const progress = music.duration > 0 ? (music.currentTime / music.duration) * 100 : 0;
    
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      music.seek(percent * music.duration);
    };

    return (
      <div className="flex items-center gap-2 text-xs text-white/60">
        <span>{formatTime(music.currentTime)}</span>
        <div 
          className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer relative group"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          />
        </div>
        <span>{formatTime(music.duration)}</span>
      </div>
    );
  };

  // Volume control component
  const VolumeControl = () => {
    const [showSlider, setShowSlider] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      music.setVolume(newVolume);
    };
    
    const handleMouseDown = () => {
      setIsDragging(true);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    // Keep slider open while dragging
    const shouldShowSlider = showSlider || isDragging;
    
    const currentVolume = music.isMuted ? 0 : music.volume;
    
    return (
      <div className="relative">
        <motion.button
          onClick={music.toggleMute}
          onMouseEnter={() => setShowSlider(true)}
          onMouseLeave={() => !isDragging && setShowSlider(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {music.isMuted || music.volume === 0 ? (
            <VolumeX className="w-4 h-4 text-white/80" />
          ) : music.volume < 0.5 ? (
            <Volume2 className="w-4 h-4 text-white/80" />
          ) : (
            <Volume2 className="w-4 h-4 text-white/80" />
          )}
        </motion.button>
        
        <AnimatePresence>
          {shouldShowSlider && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-black/90 backdrop-blur-md rounded-lg shadow-xl"
              onMouseEnter={() => setShowSlider(true)}
              onMouseLeave={() => !isDragging && setShowSlider(false)}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-white/60">
                  {Math.round(currentVolume * 100)}%
                </span>
                <div className="relative h-20 w-6 flex items-center justify-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={currentVolume}
                    onChange={handleVolumeChange}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                    className="volume-slider h-20 w-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Enhanced CSS for better slider styling */}
        <style jsx>{`
          .volume-slider {
            writing-mode: bt-lr; /* IE */
            -webkit-appearance: slider-vertical; /* WebKit */
            width: 8px;
            background: linear-gradient(to top, #3b82f6 0%, #3b82f6 ${currentVolume * 100}%, rgba(255,255,255,0.2) ${currentVolume * 100}%, rgba(255,255,255,0.2) 100%);
          }
          
          .volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .volume-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .volume-slider::-moz-range-track {
            background: rgba(255,255,255,0.2);
            height: 8px;
            border-radius: 4px;
          }
        `}</style>
      </div>
    );
  };

  if (music.isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <motion.button
          onClick={music.toggleMinimized}
          className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {music.isPlaying ? (
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-white rounded-full animate-pulse" />
              <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          ) : (
            <Music className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-t border-white/10",
        isDragging && "border-blue-500/50 bg-blue-900/20"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag and drop overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-400 flex items-center justify-center"
          >
            <div className="text-center text-blue-300">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Drop music files here</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {music.currentTrack ? (
              <>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-white font-medium truncate">
                    {music.currentTrack.title}
                  </h4>
                  <p className="text-white/60 text-sm truncate">
                    {music.currentTrack.artist || 'Unknown Artist'}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 text-white/60">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">No track selected</p>
                  <p className="text-sm">Import music to get started</p>
                </div>
              </div>
            )}
          </div>

          {/* Main controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              {/* Shuffle */}
              <motion.button
                onClick={music.toggleShuffle}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  music.isShuffled ? "bg-blue-500/30 text-blue-300" : "hover:bg-white/10 text-white/60"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shuffle className="w-4 h-4" />
              </motion.button>

              {/* Previous */}
              <motion.button
                onClick={music.previous}
                disabled={music.queue.length === 0}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SkipBack className="w-5 h-5 text-white/80" />
              </motion.button>

              {/* Play/Pause */}
              <motion.button
                onClick={music.isPlaying ? music.pause : () => music.play()}
                disabled={!music.currentTrack}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center disabled:opacity-30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {music.isPlaying ? (
                  <Pause className="w-5 h-5 text-gray-900" />
                ) : (
                  <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                )}
              </motion.button>

              {/* Next */}
              <motion.button
                onClick={music.next}
                disabled={music.queue.length === 0}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SkipForward className="w-5 h-5 text-white/80" />
              </motion.button>

              {/* Repeat */}
              <motion.button
                onClick={() => {
                  const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
                  const currentIndex = modes.indexOf(music.repeatMode);
                  const nextMode = modes[(currentIndex + 1) % modes.length];
                  music.setRepeatMode(nextMode);
                }}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  music.repeatMode !== 'none' ? "bg-blue-500/30 text-blue-300" : "hover:bg-white/10 text-white/60"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {music.repeatMode === 'one' ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </motion.button>
            </div>

            {/* Progress bar */}
            <div className="w-80">
              <ProgressBar />
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Upload button */}
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 text-white/80" />
            </motion.button>

            {/* Queue */}
            <motion.button
              onClick={music.toggleQueue}
              className={cn(
                "p-2 rounded-lg transition-colors relative",
                music.showQueue ? "bg-blue-500/30 text-blue-300" : "hover:bg-white/10 text-white/60"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List className="w-4 h-4" />
              {music.queue.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {music.queue.length}
                </span>
              )}
            </motion.button>

            {/* Visualizer */}
            <motion.button
              onClick={music.toggleVisualizer}
              className={cn(
                "p-2 rounded-lg transition-colors",
                music.showVisualizer ? "bg-blue-500/30 text-blue-300" : "hover:bg-white/10 text-white/60"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-4 h-4" />
            </motion.button>

            {/* Volume */}
            <VolumeControl />

            {/* Minimize */}
            <motion.button
              onClick={music.toggleMinimized}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Minimize2 className="w-4 h-4 text-white/60" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files);
          }
        }}
      />
    </motion.div>
  );
}
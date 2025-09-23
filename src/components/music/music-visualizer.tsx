'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Palette } from 'lucide-react';
import { useMusic } from '@/contexts/music-context';
import { useTheme } from '@/contexts/theme-context';
import { cn } from '@/lib/utils';

interface MusicVisualizerProps {
  className?: string;
}

export function MusicVisualizer({ className }: MusicVisualizerProps) {
  const music = useMusic();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [visualizerType, setVisualizerType] = useState<'bars' | 'wave' | 'circle' | 'particles'>('bars');
  const [showSettings, setShowSettings] = useState(false);

  // Initialize audio analysis
  useEffect(() => {
    if (!music.showVisualizer || !music.isPlaying) return;

    const initAudioContext = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        // Create analyzer
        if (!analyzerRef.current) {
          analyzerRef.current = audioContext.createAnalyser();
          analyzerRef.current.fftSize = 256;
          analyzerRef.current.smoothingTimeConstant = 0.8;
          
          // Get audio source (this is a simplified version - in a real app you'd connect to the actual audio element)
          dataArrayRef.current = new Uint8Array(analyzerRef.current.frequencyBinCount);
        }

        startVisualization();
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    };

    initAudioContext();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [music.showVisualizer, music.isPlaying]);

  const startVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const draw = () => {
      if (!music.showVisualizer || !music.isPlaying) return;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Generate mock audio data for demonstration
      const dataArray = generateMockAudioData();
      
      switch (visualizerType) {
        case 'bars':
          drawBars(ctx, dataArray, canvas.offsetWidth, canvas.offsetHeight);
          break;
        case 'wave':
          drawWaveform(ctx, dataArray, canvas.offsetWidth, canvas.offsetHeight);
          break;
        case 'circle':
          drawCircularVisualizer(ctx, dataArray, canvas.offsetWidth, canvas.offsetHeight);
          break;
        case 'particles':
          drawParticles(ctx, dataArray, canvas.offsetWidth, canvas.offsetHeight);
          break;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  // Generate mock audio data for demonstration
  const generateMockAudioData = () => {
    const dataArray = new Uint8Array(128);
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < dataArray.length; i++) {
      const frequency = i / dataArray.length;
      const amplitude = Math.sin(time * 2 + frequency * 10) * 
                       Math.sin(time * 3 + frequency * 5) * 
                       Math.exp(-frequency * 2);
      dataArray[i] = Math.max(0, Math.min(255, (amplitude + 1) * 127));
    }
    
    return dataArray;
  };

  const getSeasonalColors = () => {
    const season = theme.emoji;
    switch (season) {
      case '🌸': // Spring
        return ['#FF6B9D', '#C44569', '#F8B500', '#6A994E'];
      case '☀️': // Summer  
        return ['#FFD93D', '#FF6B35', '#F7931E', '#FF9F1C'];
      case '🍂': // Fall
        return ['#FF6B35', '#F7931E', '#FFAA00', '#D2691E'];
      case '❄️': // Winter
        return ['#4FC3F7', '#29B6F6', '#0288D1', '#81C784'];
      case '🌧️': // Rainy
        return ['#607D8B', '#78909C', '#90A4AE', '#B0BEC5'];
      default:
        return ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
    }
  };

  const drawBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const colors = getSeasonalColors();
    const barWidth = width / dataArray.length;
    
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * height * 0.8;
      const colorIndex = Math.floor((i / dataArray.length) * colors.length);
      
      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
      gradient.addColorStop(0, colors[colorIndex % colors.length]);
      gradient.addColorStop(1, colors[(colorIndex + 1) % colors.length]);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth * 0.8, barHeight);
    }
  };

  const drawWaveform = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const colors = getSeasonalColors();
    
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < dataArray.length; i++) {
      const x = (i / dataArray.length) * width;
      const y = height - (dataArray[i] / 255) * height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Add glow effect
    ctx.shadowColor = colors[0];
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const drawCircularVisualizer = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const colors = getSeasonalColors();
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    
    for (let i = 0; i < dataArray.length; i++) {
      const angle = (i / dataArray.length) * Math.PI * 2;
      const amplitude = (dataArray[i] / 255) * radius * 0.5;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + amplitude);
      const y2 = centerY + Math.sin(angle) * (radius + amplitude);
      
      const colorIndex = Math.floor((i / dataArray.length) * colors.length);
      ctx.strokeStyle = colors[colorIndex % colors.length];
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const colors = getSeasonalColors();
    
    for (let i = 0; i < dataArray.length; i++) {
      const amplitude = dataArray[i] / 255;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = amplitude * 5 + 1;
      
      const colorIndex = Math.floor(amplitude * colors.length);
      ctx.fillStyle = colors[Math.min(colorIndex, colors.length - 1)];
      ctx.globalAlpha = amplitude;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  };

  if (!music.showVisualizer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          "fixed inset-4 z-30 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden",
          className
        )}
      >
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h3 className="text-white font-semibold">Music Visualizer</h3>
            <div className="flex items-center gap-2">
              {['bars', 'wave', 'circle', 'particles'].map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setVisualizerType(type as any)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-sm capitalize transition-colors",
                    visualizerType === type
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5 text-white/60" />
            </motion.button>
            <motion.button
              onClick={music.toggleVisualizer}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5 text-white/60" />
            </motion.button>
          </div>
        </div>

        {/* Visualizer Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Track Info Overlay */}
        {music.currentTrack && (
          <div className="absolute bottom-4 left-4 right-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 backdrop-blur-md rounded-lg p-4"
            >
              <h4 className="text-white font-medium">{music.currentTrack.title}</h4>
              <p className="text-white/60 text-sm">{music.currentTrack.artist || 'Unknown Artist'}</p>
            </motion.div>
          </div>
        )}

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-16 right-4 w-64 bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 p-4"
            >
              <h4 className="text-white font-medium mb-4">Visualizer Settings</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Colors</label>
                  <div className="grid grid-cols-4 gap-2">
                    {getSeasonalColors().map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-white/40 text-xs mt-1">Colors adapt to current season</p>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Sensitivity</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    defaultValue="1"
                    className="w-full h-1 accent-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
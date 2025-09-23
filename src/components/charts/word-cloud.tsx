'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Download, Settings, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface WordData {
  word: string;
  count: number;
  weight: number;
  color: string;
  x: number;
  y: number;
  fontSize: number;
  rotation: number;
}

interface WordCloudProps {
  className?: string;
  thoughts?: Array<{ content: string; tags?: string; mood?: string }>;
}

export function WordCloud({ className, thoughts = [] }: WordCloudProps) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [colorMode, setColorMode] = useState<'seasonal' | 'mood' | 'random'>('seasonal');
  const [minWords, setMinWords] = useState(50);
  const [maxWords, setMaxWords] = useState(150);

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
  ]);

  const extractWords = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  };

  const getSeasonalColors = () => {
    const season = theme.emoji;
    switch (season) {
      case '🌸': // Spring
        return ['#FF6B9D', '#C44569', '#F8B500', '#6A994E', '#4ECDC4', '#FF8E53'];
      case '☀️': // Summer  
        return ['#FFD93D', '#FF6B35', '#F7931E', '#FF9F1C', '#FFA726', '#FF7043'];
      case '🍂': // Fall
        return ['#FF6B35', '#F7931E', '#FFAA00', '#D2691E', '#CD853F', '#A0522D'];
      case '❄️': // Winter
        return ['#4FC3F7', '#29B6F6', '#0288D1', '#81C784', '#64B5F6', '#42A5F5'];
      case '🌧️': // Rainy
        return ['#607D8B', '#78909C', '#90A4AE', '#B0BEC5', '#CFD8DC', '#ECEFF1'];
      default:
        return ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    }
  };

  const getMoodColors = () => {
    return {
      happy: '#10B981',
      sad: '#6B7280', 
      excited: '#F59E0B',
      calm: '#06B6D4',
      anxious: '#EF4444',
      grateful: '#8B5CF6',
      creative: '#EC4899',
      thoughtful: '#6366F1'
    };
  };

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Memoized word data computation to prevent infinite loops
  const wordData = useMemo<WordData[]>(() => {
    if (thoughts.length === 0) {
      return [];
    }

    // Extract and count words
    const wordCounts: Record<string, number> = {};
    
    thoughts.forEach(thought => {
      const words = extractWords(thought.content);
      if (thought.tags) {
        words.push(...extractWords(thought.tags));
      }
      
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });

    // Sort by frequency and take top words
    const sortedWords = Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxWords)
      .filter(([,count]) => count >= 1);

    if (sortedWords.length === 0) {
      return [];
    }

    // Generate colors based on mode
    let colors: string[];
    if (colorMode === 'seasonal') {
      colors = getSeasonalColors();
    } else if (colorMode === 'mood') {
      colors = Object.values(getMoodColors());
    } else {
      colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
    }

    // Calculate word positioning and styling
    const maxCount = Math.max(...sortedWords.map(([,count]) => count));
    const minCount = Math.min(...sortedWords.map(([,count]) => count));
    
    const words: WordData[] = sortedWords.map(([word, count], index) => {
      const weight = (count - minCount) / (maxCount - minCount);
      const fontSize = 12 + (weight * 48); // 12px to 60px
      const color = colors[index % colors.length];
      
      return {
        word,
        count,
        weight,
        color,
        fontSize,
        rotation: Math.random() > 0.7 ? (Math.random() - 0.5) * 60 : 0,
        x: 0,
        y: 0
      };
    });

    // Position words using spiral placement
    const positionWords = (words: WordData[], width: number, height: number) => {
      const center = { x: width / 2, y: height / 2 };
      const positioned: WordData[] = [];
      
      words.forEach((word, index) => {
        let placed = false;
        let attempts = 0;
        let radius = 0;
        let angle = 0;
        
        while (!placed && attempts < 100) {
          const x = center.x + Math.cos(angle) * radius;
          const y = center.y + Math.sin(angle) * radius;
          
          // Simple collision detection
          const collision = positioned.some(existing => {
            const dx = Math.abs(x - existing.x);
            const dy = Math.abs(y - existing.y);
            const minDistance = (word.fontSize + existing.fontSize) / 4;
            return dx < minDistance && dy < minDistance;
          });
          
          if (!collision && x > 50 && x < width - 50 && y > 30 && y < height - 30) {
            positioned.push({ ...word, x, y });
            placed = true;
          } else {
            angle += 0.5;
            if (angle > Math.PI * 2) {
              angle = 0;
              radius += 5;
            }
          }
          attempts++;
        }
        
        if (!placed) {
          // Fallback positioning
          positioned.push({
            ...word,
            x: center.x + (Math.random() - 0.5) * width * 0.6,
            y: center.y + (Math.random() - 0.5) * height * 0.6
          });
        }
      });
      
      return positioned;
    };

    // Use fixed canvas dimensions for positioning
    const canvasWidth = 800;
    const canvasHeight = 400;
    return positionWords(words, canvasWidth, canvasHeight);
  }, [thoughts, colorMode, maxWords, theme.emoji, refreshTrigger]); // Only recalculate when these change

  const refreshWordCloud = () => {
    setRefreshTrigger(prev => prev + 1);
  };



  const drawWordCloud = () => {
    const canvas = canvasRef.current;
    if (!canvas || wordData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw words with animation
    wordData.forEach((word, index) => {
      const animationDelay = index * 0.05;
      const wordProgress = Math.max(0, Math.min(1, animationProgress - animationDelay));
      
      if (wordProgress > 0) {
        ctx.save();
        
        // Apply animation
        const scale = wordProgress;
        const opacity = wordProgress;
        
        ctx.globalAlpha = opacity;
        ctx.translate(word.x, word.y);
        ctx.rotate((word.rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        
        // Set font
        ctx.font = `bold ${word.fontSize}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = word.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        // Draw text
        ctx.fillText(word.word, 0, 0);
        
        ctx.restore();
      }
    });
  };

  // Animation loop
  useEffect(() => {
    if (!loading && wordData.length > 0) {
      const startTime = Date.now();
      const duration = 2000; // 2 seconds
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setAnimationProgress(progress);
        drawWordCloud();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [wordData, loading]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (container && canvas) {
        canvas.width = container.offsetWidth;
        canvas.height = 400;
        drawWordCloud();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wordData]);

  const downloadWordCloud = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'word-cloud.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.card} rounded-xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-semibold ${theme.text}`}>Word Cloud</h3>
          <p className={`text-sm ${theme.accent}`}>Most frequently used words in your thoughts</p>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => refreshWordCloud()}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 ${theme.accent} ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
          
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className={`w-4 h-4 ${theme.accent}`} />
          </motion.button>
          
          <motion.button
            onClick={downloadWordCloud}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className={`w-4 h-4 ${theme.accent}`} />
          </motion.button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-4 rounded-lg space-y-4 ${
              theme.mode === 'light' 
                ? 'bg-gray-100 border border-gray-200' 
                : 'bg-white/5'
            }`}
          >
            <div>
              <label className={`block text-sm font-medium ${theme.text} mb-2`}>Color Mode</label>
              <div className="flex gap-2">
                {['seasonal', 'mood', 'random'].map((mode) => (
                  <motion.button
                    key={mode}
                    onClick={() => setColorMode(mode as any)}
                    className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                      colorMode === mode
                        ? 'bg-blue-500 text-white'
                        : theme.mode === 'light'
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {mode}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                Max Words: {maxWords}
              </label>
              <input
                type="range"
                min="50"
                max="300"
                value={maxWords}
                onChange={(e) => setMaxWords(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none slider accent-blue-500 ${
                  theme.mode === 'light' ? 'bg-gray-300' : 'bg-white/20'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Word Cloud Canvas */}
      <div ref={containerRef} className="relative w-full h-96 bg-gradient-to-br from-white/5 to-transparent rounded-lg overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
              <span className="text-white/60">Generating word cloud...</span>
            </div>
          </div>
        ) : wordData.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4 opacity-50">☁️</div>
            <h4 className={`text-lg font-medium ${theme.text} mb-2`}>
              No words to visualize
            </h4>
            <p className={`text-sm ${theme.accent} max-w-md`}>
              Start writing journal entries to see your most frequently used words appear in this beautiful word cloud.
            </p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>

      {/* Legend */}
      {wordData.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {wordData.slice(0, 10).map((word, index) => (
            <motion.div
              key={word.word}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-sm"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: word.color }}
              />
              <span className={theme.text}>{word.word}</span>
              <span className={`${theme.accent} text-xs`}>({word.count})</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
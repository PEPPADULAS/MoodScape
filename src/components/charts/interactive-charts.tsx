'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, BarChart, TrendingUp, Download, Settings } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface ChartData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface InteractiveChartsProps {
  className?: string;
  thoughts?: Array<{
    mood?: string;
    season?: string;
    tags?: string;
    createdAt: string;
  }>;
}

// Color constants moved outside component to prevent re-creation
const MOOD_COLORS = {
  happy: '#10B981',
  sad: '#6B7280',
  excited: '#F59E0B',
  calm: '#06B6D4',
  anxious: '#EF4444',
  grateful: '#8B5CF6',
  creative: '#EC4899',
  thoughtful: '#6366F1',
  energetic: '#F97316',
  peaceful: '#059669'
};

const SEASON_COLORS = {
  spring: '#10B981',
  summer: '#F59E0B',
  fall: '#EF4444',
  winter: '#06B6D4',
  rainy: '#6B7280'
};

export function InteractiveCharts({ className, thoughts = [] }: InteractiveChartsProps) {
  const { theme } = useTheme();
  const [chartType, setChartType] = useState<'mood' | 'season' | 'tags'>('mood');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);

  // Memoize chart data computation to prevent unnecessary recalculations
  const chartData = useMemo<ChartData[]>(() => {
    let data: Record<string, number> = {};
    let colors: Record<string, string> = {};

    // Only use real user data - no sample data
    if (thoughts.length === 0) {
      return [];
    }

    // Process real data
    thoughts.forEach(thought => {
      let key: string;
      if (chartType === 'mood' && thought.mood) {
        key = thought.mood;
        colors = MOOD_COLORS;
      } else if (chartType === 'season' && thought.season) {
        key = thought.season;
        colors = SEASON_COLORS;
      } else if (chartType === 'tags' && thought.tags) {
        const tags = typeof thought.tags === 'string' 
          ? thought.tags.split(',').map((tag: string) => tag.trim().toLowerCase())
          : Array.isArray(thought.tags) 
            ? (thought.tags as any[]).map((tag: any) => tag.toString().trim().toLowerCase())
            : [];
        tags.forEach((tag: string) => {
          if (tag) {
            data[tag] = (data[tag] || 0) + 1;
          }
        });
        return;
      } else {
        return;
      }
      
      if (key) {
        data[key] = (data[key] || 0) + 1;
      }
    });

    // For tags, generate colors dynamically
    if (chartType === 'tags') {
      const tagColors = ['#8B5CF6', '#10B981', '#F59E0B', '#06B6D4', '#EC4899', '#EF4444', '#6366F1', '#F97316'];
      Object.keys(data).forEach((tag, index) => {
        colors[tag] = tagColors[index % tagColors.length];
      });
    }

    // Convert to chart data
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
      return [];
    }

    const chartDataArray: ChartData[] = Object.entries(data)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8) // Limit to top 8 items
      .map(([label, value]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value,
        color: colors[label] || '#6B7280',
        percentage: (value / total) * 100
      }));

    return chartDataArray;
  }, [thoughts, chartType]); // Only recalculate when thoughts or chartType changes

  // Start animation when chart data changes
  useEffect(() => {
    if (chartData.length === 0) {
      setAnimationProgress(0);
      return;
    }

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setAnimationProgress(0);
    const startTime = Date.now();
    const duration = 1500;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [chartData]); // Only trigger animation when chartData changes

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const renderPieChart = () => {
    const size = 280;
    const center = size / 2;
    const radius = size * 0.35;
    const innerRadius = radius * 0.4; // For donut chart
    
    let currentAngle = 0;
    
    return (
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform transition-transform duration-300"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="2"
        />
        
        {/* Pie segments */}
        {chartData.map((data, index) => {
          const startAngle = currentAngle;
          const endAngle = currentAngle + (data.percentage / 100) * 360 * animationProgress;
          currentAngle += (data.percentage / 100) * 360;
          
          const startAngleRad = (startAngle - 90) * (Math.PI / 180);
          const endAngleRad = (endAngle - 90) * (Math.PI / 180);
          
          const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
          
          const x1 = center + Math.cos(startAngleRad) * innerRadius;
          const y1 = center + Math.sin(startAngleRad) * innerRadius;
          const x2 = center + Math.cos(endAngleRad) * innerRadius;
          const y2 = center + Math.sin(endAngleRad) * innerRadius;
          
          const x3 = center + Math.cos(endAngleRad) * radius;
          const y3 = center + Math.sin(endAngleRad) * radius;
          const x4 = center + Math.cos(startAngleRad) * radius;
          const y4 = center + Math.sin(startAngleRad) * radius;
          
          const pathData = [
            `M ${x1} ${y1}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            'Z'
          ].join(' ');
          
          const isHovered = hoveredSegment?.label === data.label;
          
          return (
            <motion.path
              key={data.label}
              d={pathData}
              fill={data.color}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer"
              onHoverStart={() => setHoveredSegment(data)}
              onHoverEnd={() => setHoveredSegment(null)}
              whileHover={{ 
                scale: 1.05,
                filter: 'brightness(1.1)'
              }}
              style={{
                transformOrigin: `${center}px ${center}px`,
                filter: isHovered ? 'brightness(1.1)' : 'none'
              }}
            />
          );
        })}
        
        {/* Center text */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          className={`text-lg font-bold ${theme.text}`}
          fill="currentColor"
        >
          {chartData.reduce((sum, data) => sum + data.value, 0)}
        </text>
        <text
          x={center}
          y={center + 10}
          textAnchor="middle"
          className={`text-sm ${theme.accent}`}
          fill="currentColor"
        >
          Total
        </text>
      </svg>
    );
  };

  const renderProgressBars = () => {
    return (
      <div className="space-y-4">
        {chartData.map((data, index) => (
          <motion.div
            key={data.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: data.color }}
                />
                <span className={`font-medium ${theme.text}`}>
                  {data.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${theme.accent}`}>
                  {data.value}
                </span>
                <span className={`text-xs ${theme.accent}`}>
                  ({data.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: data.color }}
                initial={{ width: 0 }}
                animate={{ width: `${data.percentage * animationProgress}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const downloadChart = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 280;
    canvas.height = 280;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `${chartType}-chart.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
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
          <h3 className={`text-lg font-semibold ${theme.text}`}>
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Distribution
          </h3>
          <p className={`text-sm ${theme.accent}`}>
            Visual breakdown of your {chartType} patterns
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={downloadChart}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className={`w-4 h-4 ${theme.accent}`} />
          </motion.button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className={`flex gap-1 mb-6 p-1 rounded-lg ${
        theme.mode === 'light' ? 'bg-gray-100' : 'bg-white/5'
      }`}>
        {['mood', 'season', 'tags'].map((type) => (
          <motion.button
            key={type}
            onClick={() => setChartType(type as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
              chartType === type
                ? theme.mode === 'light'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/20 text-white'
                : theme.mode === 'light'
                ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                : 'text-white/60 hover:text-white/80'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className={`text-6xl mb-4 opacity-50`}>📊</div>
          <h4 className={`text-lg font-medium ${theme.text} mb-2`}>
            No {chartType} data available
          </h4>
          <p className={`text-sm ${theme.accent} max-w-md`}>
            Start creating journal entries with {chartType} information to see your patterns visualized here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="flex flex-col items-center">
            <h4 className={`text-md font-medium ${theme.text} mb-4`}>
              Distribution Chart
            </h4>
            <div className="relative">
              {renderPieChart()}
              
              {/* Hover tooltip */}
              <AnimatePresence>
                {hoveredSegment && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-2 left-2 bg-black/90 backdrop-blur-md rounded-lg p-3 pointer-events-none z-10"
                  >
                    <div className="text-white text-sm">
                      <div className="font-medium">{hoveredSegment.label}</div>
                      <div className="text-white/60">
                        {hoveredSegment.value} items ({hoveredSegment.percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            <h4 className={`text-md font-medium ${theme.text} mb-4`}>
              Detailed Breakdown
            </h4>
            {renderProgressBars()}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && chartData.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.text}`}>
                {chartData.length}
              </div>
              <div className={`text-sm ${theme.accent}`}>
                Categories
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.text}`}>
                {chartData.reduce((sum, data) => sum + data.value, 0)}
              </div>
              <div className={`text-sm ${theme.accent}`}>
                Total Items
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.text}`}>
                {chartData[0]?.label || 'N/A'}
              </div>
              <div className={`text-sm ${theme.accent}`}>
                Most Common
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.text}`}>
                {chartData[0]?.percentage.toFixed(0) || '0'}%
              </div>
              <div className={`text-sm ${theme.accent}`}>
                Top Category
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
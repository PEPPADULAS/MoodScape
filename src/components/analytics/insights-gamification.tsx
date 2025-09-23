'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Target, 
  TrendingUp, 
  Brain, 
  Calendar, 
  Award, 
  Clock,
  Zap,
  Star,
  Trophy,
  Medal,
  Crown
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface InsightData {
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  dailyAverage: number;
  productiveHours: number[];
  moodPrediction: {
    trend: 'improving' | 'stable' | 'declining';
    confidence: number;
    recommendation: string;
  };
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    reward: string;
    icon: string;
  }>;
  weeklyStats: {
    thoughtsThisWeek: number;
    wordsThisWeek: number;
    moodsThisWeek: string[];
    streakStatus: 'on-fire' | 'good' | 'needs-attention';
  };
}

interface InsightsGamificationProps {
  className?: string;
  thoughts?: Array<{
    content: string;
    mood?: string;
    createdAt: string;
  }>;
}

export function InsightsGamification({ className, thoughts = [] }: InsightsGamificationProps) {
  const { theme } = useTheme();
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);

  useEffect(() => {
    generateInsights();
  }, [thoughts]);

  const generateInsights = () => {
    setLoading(true);

    // Calculate writing streaks
    const today = new Date();
    const dates = new Set();
    thoughts.forEach(thought => {
      const date = new Date(thought.createdAt).toDateString();
      dates.add(date);
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak (consecutive days from today backwards)
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      if (dates.has(dateStr)) {
        if (i === 0 || currentStreak > 0) {
          currentStreak++;
        }
        tempStreak++;
      } else {
        if (currentStreak === 0 && i === 0) {
          // Today hasn't been written in yet
          continue;
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
        if (i <= 1) {
          currentStreak = 0;
        }
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    // Calculate weekly stats
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const weeklyThoughts = thoughts.filter(t => 
      new Date(t.createdAt) >= oneWeekAgo
    );

    const weeklyMoods = [...new Set(weeklyThoughts.map(t => t.mood).filter(Boolean))];
    const weeklyWords = weeklyThoughts.reduce((total, thought) => 
      total + thought.content.split(' ').length, 0
    );

    // Mood prediction (simplified algorithm)
    const recentMoods = thoughts
      .slice(0, 10)
      .map(t => t.mood)
      .filter(Boolean);
    
    const positiveMotions = ['happy', 'excited', 'grateful', 'calm', 'creative'];
    const recentPositiveCount = recentMoods.filter(mood => 
      mood && positiveMotions.includes(mood)
    ).length;
    
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    let confidence = 0.7;
    let recommendation = 'Keep maintaining your current writing practice.';
    
    if (recentPositiveCount / recentMoods.length > 0.6) {
      trend = 'improving';
      recommendation = 'Your mood patterns show positive trends! Keep up the great work.';
      confidence = 0.8;
    } else if (recentPositiveCount / recentMoods.length < 0.3) {
      trend = 'declining';
      recommendation = 'Consider exploring activities that boost your mood, like gratitude writing.';
      confidence = 0.75;
    }

    // Generate milestones
    const milestones = [
      {
        id: 'streak_7',
        title: '7-Day Streak',
        description: 'Write for 7 consecutive days',
        progress: Math.min(currentStreak, 7),
        target: 7,
        reward: 'Consistency Badge',
        icon: '🔥'
      },
      {
        id: 'thoughts_50',
        title: '50 Thoughts',
        description: 'Create 50 journal entries',
        progress: Math.min(thoughts.length, 50),
        target: 50,
        reward: 'Prolific Writer Badge',
        icon: '📝'
      },
      {
        id: 'words_10k',
        title: '10,000 Words',
        description: 'Write 10,000 words total',
        progress: Math.min(
          thoughts.reduce((total, t) => total + t.content.split(' ').length, 0),
          10000
        ),
        target: 10000,
        reward: 'Wordsmith Badge',
        icon: '✍️'
      },
      {
        id: 'weekly_goal',
        title: 'Weekly Goal',
        description: 'Write 5 entries this week',
        progress: Math.min(weeklyThoughts.length, 5),
        target: 5,
        reward: 'Weekly Champion',
        icon: '🎯'
      }
    ];

    const insightData: InsightData = {
      currentStreak,
      longestStreak,
      weeklyGoal: 5,
      weeklyProgress: weeklyThoughts.length,
      dailyAverage: thoughts.length / Math.max(1, Math.ceil((Date.now() - new Date(thoughts[thoughts.length - 1]?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))),
      productiveHours: [9, 14, 16, 20], // Sample productive hours
      moodPrediction: {
        trend,
        confidence,
        recommendation
      },
      milestones,
      weeklyStats: {
        thoughtsThisWeek: weeklyThoughts.length,
        wordsThisWeek: weeklyWords,
        moodsThisWeek: weeklyMoods.filter((mood): mood is string => mood !== undefined),
        streakStatus: currentStreak >= 7 ? 'on-fire' : currentStreak >= 3 ? 'good' : 'needs-attention'
      }
    };

    setInsights(insightData);
    setLoading(false);
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (streak >= 14) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (streak >= 7) return <Medal className="w-6 h-6 text-orange-400" />;
    if (streak >= 3) return <Flame className="w-6 h-6 text-red-400" />;
    return <Zap className="w-6 h-6 text-blue-400" />;
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Legendary Writer! 🎉";
    if (streak >= 14) return "Writing Master! 🏆";
    if (streak >= 7) return "On Fire! 🔥";
    if (streak >= 3) return "Good Momentum! ⚡";
    if (streak >= 1) return "Getting Started! 🌱";
    return "Ready to Begin! 💫";
  };

  const getMoodTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'declining': return <TrendingUp className="w-5 h-5 text-red-400 transform rotate-180" />;
      default: return <Target className="w-5 h-5 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className={`${theme.card} rounded-xl p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-300 rounded"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.card} rounded-xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-semibold ${theme.text}`}>Insights & Progress</h3>
          <p className={`text-sm ${theme.accent}`}>Your writing journey analytics</p>
        </div>
        <Star className={`w-6 h-6 ${theme.accent}`} />
      </div>

      {/* Writing Streak Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex justify-center mb-3">
            {getStreakIcon(insights.currentStreak)}
          </div>
          <div className={`text-3xl font-bold ${theme.text} mb-1`}>
            {insights.currentStreak}
          </div>
          <div className={`text-sm ${theme.accent} mb-2`}>Current Streak</div>
          <div className="text-xs text-orange-400 font-medium">
            {getStreakMessage(insights.currentStreak)}
          </div>
        </motion.div>

        <motion.div
          className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex justify-center mb-3">
            <Award className="w-6 h-6 text-purple-400" />
          </div>
          <div className={`text-3xl font-bold ${theme.text} mb-1`}>
            {insights.longestStreak}
          </div>
          <div className={`text-sm ${theme.accent} mb-2`}>Longest Streak</div>
          <div className="text-xs text-purple-400 font-medium">
            Personal Best
          </div>
        </motion.div>

        <motion.div
          className="text-center p-6 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl border border-green-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex justify-center mb-3">
            <Target className="w-6 h-6 text-green-400" />
          </div>
          <div className={`text-3xl font-bold ${theme.text} mb-1`}>
            {insights.weeklyProgress}/{insights.weeklyGoal}
          </div>
          <div className={`text-sm ${theme.accent} mb-2`}>Weekly Progress</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-green-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(insights.weeklyProgress / insights.weeklyGoal) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Mood Prediction */}
      <motion.div
        className="mb-8 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-indigo-400" />
          <h4 className={`text-lg font-semibold ${theme.text}`}>Mood Insights</h4>
          <div className="flex items-center gap-2">
            {getMoodTrendIcon(insights.moodPrediction.trend)}
            <span className={`text-sm ${theme.accent}`}>
              {(insights.moodPrediction.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        </div>
        
        <p className={`${theme.text} mb-2`}>
          Trend: <span className="font-medium capitalize">{insights.moodPrediction.trend}</span>
        </p>
        <p className={`text-sm ${theme.accent}`}>
          {insights.moodPrediction.recommendation}
        </p>
      </motion.div>

      {/* Milestones */}
      <div className="mb-8">
        <h4 className={`text-lg font-semibold ${theme.text} mb-4`}>Milestones</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                milestone.progress >= milestone.target
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMilestone(milestone)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{milestone.icon}</span>
                  <span className={`font-medium ${theme.text}`}>
                    {milestone.title}
                  </span>
                </div>
                {milestone.progress >= milestone.target && (
                  <Trophy className="w-5 h-5 text-yellow-400" />
                )}
              </div>
              
              <p className={`text-sm ${theme.accent} mb-3`}>
                {milestone.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={theme.accent}>
                    Progress: {milestone.progress}/{milestone.target}
                  </span>
                  <span className={theme.accent}>
                    {((milestone.progress / milestone.target) * 100).toFixed(0)}%
                  </span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      milestone.progress >= milestone.target
                        ? 'bg-green-400'
                        : 'bg-blue-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min((milestone.progress / milestone.target) * 100, 100)}%` 
                    }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Summary */}
      <motion.div
        className="p-6 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl border border-teal-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h4 className={`text-lg font-semibold ${theme.text} mb-4`}>This Week's Highlights</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.text}`}>
              {insights.weeklyStats.thoughtsThisWeek}
            </div>
            <div className={`text-sm ${theme.accent}`}>Thoughts</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.text}`}>
              {insights.weeklyStats.wordsThisWeek.toLocaleString()}
            </div>
            <div className={`text-sm ${theme.accent}`}>Words</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.text}`}>
              {insights.weeklyStats.moodsThisWeek.length}
            </div>
            <div className={`text-sm ${theme.accent}`}>Moods</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl">
              {insights.weeklyStats.streakStatus === 'on-fire' ? '🔥' : 
               insights.weeklyStats.streakStatus === 'good' ? '⚡' : '🌱'}
            </div>
            <div className={`text-sm ${theme.accent} capitalize`}>
              {insights.weeklyStats.streakStatus.replace('-', ' ')}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Milestone Detail Modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{selectedMilestone.icon}</div>
                <h3 className="text-white font-semibold text-xl mb-2">
                  {selectedMilestone.title}
                </h3>
                <p className="text-white/60">
                  {selectedMilestone.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {selectedMilestone.progress}/{selectedMilestone.target}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div
                      className="bg-blue-400 h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((selectedMilestone.progress / selectedMilestone.target) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-yellow-400 mb-2">🏆</div>
                  <div className="text-white/80 text-sm">
                    Reward: {selectedMilestone.reward}
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={() => setSelectedMilestone(null)}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
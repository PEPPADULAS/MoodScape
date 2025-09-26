/**
 * Utility functions for the personalization system
 */

// Get current week number
export const getCurrentWeek = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
};

// Get today's date key for localStorage
export const getTodaysDateKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
};

// Get user's recent moods from entries
export const getRecentMoods = (entries: any[], limit = 5) => {
  return entries
    .slice(0, limit)
    .map(entry => entry.mood)
    .filter(mood => mood)
    .map(mood => mood.toLowerCase());
};

// Get most frequent mood from entries
export const getMostFrequentMood = (entries: any[]) => {
  if (entries.length === 0) return null;
  
  const moodCount: Record<string, number> = {};
  entries.forEach(entry => {
    if (entry.mood) {
      const mood = entry.mood.toLowerCase();
      moodCount[mood] = (moodCount[mood] || 0) + 1;
    }
  });
  
  let mostFrequentMood = null;
  let maxCount = 0;
  
  for (const [mood, count] of Object.entries(moodCount)) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentMood = mood;
    }
  }
  
  return mostFrequentMood;
};
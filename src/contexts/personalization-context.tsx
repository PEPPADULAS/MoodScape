'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import quotesData from '@/data/quotes.json';
import weeklyWordsData from '@/data/weekly-words.json';
import { getCurrentWeek, getTodaysDateKey, getMostFrequentMood } from '@/lib/personalization-utils';

// Types
interface Quote {
  id: number;
  text: string;
  author: string;
  category: string;
  moods: string[];
}

interface WeeklyTheme {
  week: number;
  words: string[];
  category: string;
}

interface PersonalizationContextType {
  currentQuote: Quote | null;
  weeklyWords: string[];
  personalizedPrompt: string | null;
  updateQuote: (mood?: string) => void;
  updateWeeklyWords: () => void;
  generatePersonalizedPrompt: (userEntries: any[]) => void;
}

// Create context
const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [weeklyWords, setWeeklyWords] = useState<string[]>([]);
  const [personalizedPrompt, setPersonalizedPrompt] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load quote
      const savedQuote = localStorage.getItem('moodscape-daily-quote');
      const savedQuoteDate = localStorage.getItem('moodscape-daily-quote-date');
      
      if (savedQuote && savedQuoteDate === getTodaysDateKey()) {
        try {
          setCurrentQuote(JSON.parse(savedQuote));
        } catch (error) {
          console.error('Failed to parse saved quote:', error);
          updateQuote();
        }
      } else {
        updateQuote();
      }
      
      // Load weekly words
      const savedWords = localStorage.getItem('moodscape-weekly-words');
      const savedWeek = localStorage.getItem('moodscape-weekly-words-week');
      
      if (savedWords && savedWeek === getCurrentWeek().toString()) {
        try {
          const parsedWords = JSON.parse(savedWords);
          // Ensure parsedWords is an array
          if (Array.isArray(parsedWords)) {
            setWeeklyWords(parsedWords);
          } else {
            updateWeeklyWords();
          }
        } catch (error) {
          console.error('Failed to parse weekly words:', error);
          updateWeeklyWords();
        }
      } else {
        updateWeeklyWords();
      }
    }
  }, []);

  // Update quote function
  const updateQuote = (mood?: string) => {
    const quotes: Quote[] = quotesData.quotes;
    
    // Filter by mood if provided
    let filteredQuotes = quotes;
    if (mood) {
      filteredQuotes = quotes.filter(quote => 
        quote.moods.includes(mood.toLowerCase())
      );
    }
    
    // If no quotes match the mood, use all quotes
    if (filteredQuotes.length === 0) {
      filteredQuotes = quotes;
    }
    
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote = filteredQuotes[randomIndex];
    
    setCurrentQuote(selectedQuote);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodscape-daily-quote', JSON.stringify(selectedQuote));
      localStorage.setItem('moodscape-daily-quote-date', getTodaysDateKey());
    }
  };

  // Update weekly words function
  const updateWeeklyWords = () => {
    try {
      const currentWeek = getCurrentWeek();
      const themes: WeeklyTheme[] = weeklyWordsData.themes;
      
      // Find theme for current week (or cycle through if week > themes.length)
      const themeIndex = (currentWeek - 1) % themes.length;
      const currentTheme = themes[themeIndex];
      
      // Ensure currentTheme.words is an array
      const wordsArray = Array.isArray(currentTheme.words) ? currentTheme.words : [];
      setWeeklyWords(wordsArray);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('moodscape-weekly-words', JSON.stringify(wordsArray));
        localStorage.setItem('moodscape-weekly-words-week', currentWeek.toString());
      }
    } catch (error) {
      console.error('Failed to update weekly words:', error);
      // Set empty array as fallback
      setWeeklyWords([]);
    }
  };

  // Generate personalized prompt based on user entries
  const generatePersonalizedPrompt = (userEntries: any[]) => {
    if (userEntries.length === 0) {
      setPersonalizedPrompt("What's on your mind today?");
      return;
    }
    
    // Get the most frequent mood from recent entries
    const frequentMood = getMostFrequentMood(userEntries);
    
    // Prompt generation logic based on mood and entry patterns
    const prompts = [
      "Reflect on a moment from today that brought you joy.",
      "Write about a challenge you faced recently and what you learned from it.",
      "Describe a goal you're working towards and the steps you're taking to achieve it.",
      "Explore a recent emotion you've experienced and what might have triggered it.",
      "Write about someone who has influenced your perspective recently.",
      "What's something new you'd like to learn about this week?",
      "Describe your ideal day and what would make it meaningful.",
      "Write about a decision you're considering and how you might approach it.",
      "Reflect on a relationship that has grown or changed recently.",
      "What's one thing you're grateful for today and why?"
    ];
    
    // Add mood-specific prompts if we have a frequent mood
    const moodPrompts: Record<string, string[]> = {
      happy: [
        "What made you smile today?",
        "Describe a moment when you felt truly content.",
        "What are you looking forward to this week?"
      ],
      sad: [
        "What emotions are you experiencing right now?",
        "Write about something that helped you feel better recently.",
        "What do you need right now to feel supported?"
      ],
      anxious: [
        "What's causing you to feel anxious today?",
        "Write down three things you can control right now.",
        "Describe a calming place you can visualize."
      ],
      excited: [
        "What are you most excited about?",
        "Describe the energy you're feeling right now.",
        "What opportunities feel available to you?"
      ]
    };
    
    let allPrompts = [...prompts];
    if (frequentMood && moodPrompts[frequentMood]) {
      allPrompts = [...prompts, ...moodPrompts[frequentMood]];
    }
    
    const randomIndex = Math.floor(Math.random() * allPrompts.length);
    setPersonalizedPrompt(allPrompts[randomIndex]);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodscape-personalized-prompt', allPrompts[randomIndex]);
      localStorage.setItem('moodscape-personalized-prompt-date', getTodaysDateKey());
    }
  };

  // Load personalized prompt from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPrompt = localStorage.getItem('moodscape-personalized-prompt');
      const savedPromptDate = localStorage.getItem('moodscape-personalized-prompt-date');
      
      if (savedPrompt && savedPromptDate === getTodaysDateKey()) {
        setPersonalizedPrompt(savedPrompt);
      }
    }
  }, []);

  return (
    <PersonalizationContext.Provider
      value={{
        currentQuote,
        weeklyWords,
        personalizedPrompt,
        updateQuote,
        updateWeeklyWords,
        generatePersonalizedPrompt
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
}
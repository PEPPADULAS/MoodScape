import { ACHIEVEMENTS } from './achievements'

export interface TagSuggestion {
  tag: string
  confidence: number
  category: 'mood' | 'activity' | 'theme' | 'object' | 'location'
}

export class SmartTagService {
  private static moodKeywords = {
    happy: ['happy', 'joy', 'excited', 'cheerful', 'delighted', 'glad', 'content', 'elated', 'blissful'],
    sad: ['sad', 'depressed', 'down', 'melancholy', 'gloomy', 'dejected', 'sorrowful', 'mournful'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'concerned', 'uneasy', 'troubled', 'fearful'],
    calm: ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed', 'composed', 'still', 'quiet'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciative', 'grateful for', 'thank you', 'blessed'],
    excited: ['excited', 'thrilled', 'enthusiastic', 'eager', 'pumped', 'energetic', 'animated']
  }

  private static activityKeywords = {
    work: ['work', 'job', 'office', 'meeting', 'project', 'deadline', 'colleague', 'boss', 'career'],
    exercise: ['exercise', 'workout', 'gym', 'running', 'walking', 'yoga', 'fitness', 'sports'],
    reading: ['reading', 'book', 'novel', 'article', 'magazine', 'story', 'chapter', 'library'],
    cooking: ['cooking', 'recipe', 'kitchen', 'food', 'meal', 'dinner', 'lunch', 'breakfast'],
    travel: ['travel', 'trip', 'vacation', 'journey', 'adventure', 'explore', 'visit', 'destination'],
    music: ['music', 'song', 'concert', 'album', 'artist', 'melody', 'rhythm', 'lyrics'],
    nature: ['nature', 'outdoors', 'forest', 'mountain', 'beach', 'hiking', 'camping', 'wildlife'],
    family: ['family', 'parents', 'children', 'siblings', 'relatives', 'reunion', 'home', 'love'],
    friends: ['friends', 'friendship', 'social', 'party', 'gathering', 'celebration', 'together']
  }

  private static themeKeywords = {
    growth: ['growth', 'learning', 'progress', 'development', 'improvement', 'change', 'evolve'],
    reflection: ['reflection', 'thinking', 'contemplation', 'memory', 'past', 'remember', 'consider'],
    goals: ['goals', 'dreams', 'aspirations', 'plans', 'future', 'ambition', 'vision', 'hope'],
    relationships: ['relationship', 'love', 'friendship', 'connection', 'bond', 'trust', 'communication'],
    creativity: ['creative', 'art', 'design', 'writing', 'imagination', 'inspiration', 'ideas'],
    mindfulness: ['mindful', 'present', 'awareness', 'meditation', 'focus', 'attention', 'moment'],
    success: ['success', 'achievement', 'accomplishment', 'victory', 'win', 'triumph', 'pride'],
    challenge: ['challenge', 'difficult', 'struggle', 'overcome', 'perseverance', 'resilience']
  }

  private static objectKeywords = {
    coffee: ['coffee', 'espresso', 'latte', 'cappuccino', 'caffeine', 'cafe', 'morning brew'],
    book: ['book', 'novel', 'story', 'reading', 'pages', 'chapter', 'author', 'literature'],
    phone: ['phone', 'mobile', 'smartphone', 'call', 'text', 'app', 'screen', 'technology'],
    car: ['car', 'driving', 'vehicle', 'road', 'traffic', 'commute', 'journey', 'auto'],
    computer: ['computer', 'laptop', 'screen', 'keyboard', 'mouse', 'digital', 'technology'],
    camera: ['camera', 'photo', 'picture', 'photography', 'lens', 'capture', 'image'],
    flowers: ['flowers', 'bloom', 'petals', 'garden', 'roses', 'tulips', 'bouquet', 'blossom']
  }

  private static locationKeywords = {
    home: ['home', 'house', 'apartment', 'room', 'bedroom', 'kitchen', 'living room', 'cozy'],
    office: ['office', 'workplace', 'desk', 'cubicle', 'meeting room', 'conference', 'building'],
    park: ['park', 'playground', 'bench', 'trees', 'grass', 'pond', 'walking path'],
    restaurant: ['restaurant', 'cafe', 'diner', 'bistro', 'dining', 'waiter', 'menu', 'food'],
    beach: ['beach', 'ocean', 'sand', 'waves', 'shore', 'seaside', 'coastal', 'water'],
    mountain: ['mountain', 'hill', 'peak', 'summit', 'valley', 'hiking', 'altitude', 'view'],
    city: ['city', 'urban', 'downtown', 'street', 'buildings', 'traffic', 'busy', 'metro']
  }

  static generateSuggestions(content: string, userHistory?: Array<{ content: string, tags?: string[] }>): TagSuggestion[] {
    const suggestions: TagSuggestion[] = []
    const words = content.toLowerCase().split(/\s+/)
    const contentLower = content.toLowerCase()

    // Analyze mood
    for (const [mood, keywords] of Object.entries(this.moodKeywords)) {
      const matches = keywords.filter(keyword => 
        contentLower.includes(keyword) || words.some(word => word.includes(keyword))
      )
      if (matches.length > 0) {
        suggestions.push({
          tag: mood,
          confidence: Math.min(matches.length * 0.3, 0.9),
          category: 'mood'
        })
      }
    }

    // Analyze activities
    for (const [activity, keywords] of Object.entries(this.activityKeywords)) {
      const matches = keywords.filter(keyword => 
        contentLower.includes(keyword) || words.some(word => word.includes(keyword))
      )
      if (matches.length > 0) {
        suggestions.push({
          tag: activity,
          confidence: Math.min(matches.length * 0.25, 0.8),
          category: 'activity'
        })
      }
    }

    // Analyze themes
    for (const [theme, keywords] of Object.entries(this.themeKeywords)) {
      const matches = keywords.filter(keyword => 
        contentLower.includes(keyword) || words.some(word => word.includes(keyword))
      )
      if (matches.length > 0) {
        suggestions.push({
          tag: theme,
          confidence: Math.min(matches.length * 0.2, 0.7),
          category: 'theme'
        })
      }
    }

    // Analyze objects
    for (const [object, keywords] of Object.entries(this.objectKeywords)) {
      const matches = keywords.filter(keyword => 
        contentLower.includes(keyword) || words.some(word => word.includes(keyword))
      )
      if (matches.length > 0) {
        suggestions.push({
          tag: object,
          confidence: Math.min(matches.length * 0.3, 0.8),
          category: 'object'
        })
      }
    }

    // Analyze locations
    for (const [location, keywords] of Object.entries(this.locationKeywords)) {
      const matches = keywords.filter(keyword => 
        contentLower.includes(keyword) || words.some(word => word.includes(keyword))
      )
      if (matches.length > 0) {
        suggestions.push({
          tag: location,
          confidence: Math.min(matches.length * 0.25, 0.75),
          category: 'location'
        })
      }
    }

    // Enhance with user history patterns
    if (userHistory && userHistory.length > 0) {
      const historicalTags = this.analyzeUserPatterns(userHistory, contentLower)
      suggestions.push(...historicalTags)
    }

    // Remove duplicates and sort by confidence
    const uniqueSuggestions = suggestions.reduce((acc, suggestion) => {
      const existing = acc.find(s => s.tag === suggestion.tag)
      if (existing) {
        existing.confidence = Math.max(existing.confidence, suggestion.confidence)
      } else {
        acc.push(suggestion)
      }
      return acc
    }, [] as TagSuggestion[])

    return uniqueSuggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8) // Limit to top 8 suggestions
  }

  private static analyzeUserPatterns(history: Array<{ content: string, tags?: string[] }>, currentContent: string): TagSuggestion[] {
    const suggestions: TagSuggestion[] = []
    const tagFrequency: Record<string, number> = {}

    // Count tag usage frequency
    history.forEach(entry => {
      entry.tags?.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
      })
    })

    // Find similar content patterns
    const currentWords = new Set(currentContent.split(/\s+/))
    
    history.forEach(entry => {
      const entryWords = new Set(entry.content.toLowerCase().split(/\s+/))
      const commonWords = [...currentWords].filter(word => entryWords.has(word))
      
      if (commonWords.length >= 2) { // If there are at least 2 common words
        const similarity = commonWords.length / Math.max(currentWords.size, entryWords.size)
        
        entry.tags?.forEach(tag => {
          const frequency = tagFrequency[tag] || 1
          const confidence = Math.min(similarity * 0.6 + (frequency / history.length) * 0.4, 0.8)
          
          if (confidence > 0.3) {
            suggestions.push({
              tag,
              confidence,
              category: 'activity' // Default category for historical patterns
            })
          }
        })
      }
    })

    return suggestions
  }

  static suggestHashtags(content: string): string[] {
    const hashtags: string[] = []
    const contentLower = content.toLowerCase()

    // Extract potential hashtags from content
    const hashtagMatches = content.match(/#\w+/g)
    if (hashtagMatches) {
      hashtags.push(...hashtagMatches)
    }

    // Generate trending-style hashtags
    if (contentLower.includes('monday') || contentLower.includes('week')) {
      hashtags.push('#MondayMotivation', '#NewWeek')
    }
    if (contentLower.includes('grateful') || contentLower.includes('thankful')) {
      hashtags.push('#Gratitude', '#Blessed')
    }
    if (contentLower.includes('morning')) {
      hashtags.push('#MorningThoughts', '#NewDay')
    }
    if (contentLower.includes('reflection') || contentLower.includes('thinking')) {
      hashtags.push('#Reflection', '#DeepThoughts')
    }
    if (contentLower.includes('goal') || contentLower.includes('dream')) {
      hashtags.push('#Goals', '#Dreams', '#Ambition')
    }

    return [...new Set(hashtags)].slice(0, 5)
  }

  static detectSentiment(content: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = [
      'happy', 'joy', 'love', 'excited', 'amazing', 'wonderful', 'great', 'excellent', 
      'fantastic', 'beautiful', 'perfect', 'awesome', 'brilliant', 'successful', 'grateful'
    ]
    
    const negativeWords = [
      'sad', 'angry', 'frustrated', 'disappointed', 'worried', 'anxious', 'terrible', 
      'awful', 'horrible', 'depressed', 'stressed', 'difficult', 'problem', 'hate'
    ]

    const words = content.toLowerCase().split(/\s+/)
    let positiveScore = 0
    let negativeScore = 0

    words.forEach(word => {
      if (positiveWords.some(positive => word.includes(positive))) {
        positiveScore++
      }
      if (negativeWords.some(negative => word.includes(negative))) {
        negativeScore++
      }
    })

    if (positiveScore > negativeScore) return 'positive'
    if (negativeScore > positiveScore) return 'negative'
    return 'neutral'
  }
}
import { FontOption } from '../types/customization';

export const FONT_OPTIONS: FontOption[] = [
  // Serif Fonts
  {
    id: 'times-new-roman',
    name: 'Times New Roman',
    category: 'serif',
    fontFamily: '"Times New Roman", Times, serif',
    preview: 'The quick brown fox jumps over the lazy dog'
  },
  {
    id: 'georgia',
    name: 'Georgia',
    category: 'serif',
    fontFamily: 'Georgia, serif',
    preview: 'Elegant and readable for long texts'
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    category: 'serif',
    fontFamily: '"Playfair Display", serif',
    googleFont: 'Playfair+Display:wght@400;500;600;700',
    preview: 'Sophisticated and dramatic serif'
  },
  {
    id: 'crimson-text',
    name: 'Crimson Text',
    category: 'serif',
    fontFamily: '"Crimson Text", serif',
    googleFont: 'Crimson+Text:wght@400;600',
    preview: 'Perfect for literary writing'
  },

  // Sans-serif Fonts
  {
    id: 'arial',
    name: 'Arial',
    category: 'sans-serif',
    fontFamily: 'Arial, sans-serif',
    preview: 'Clean and universally readable'
  },
  {
    id: 'helvetica',
    name: 'Helvetica',
    category: 'sans-serif',
    fontFamily: 'Helvetica, Arial, sans-serif',
    preview: 'Modern and professional'
  },
  {
    id: 'inter',
    name: 'Inter',
    category: 'sans-serif',
    fontFamily: 'Inter, sans-serif',
    googleFont: 'Inter:wght@300;400;500;600;700',
    preview: 'Designed for user interfaces'
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'sans-serif',
    fontFamily: 'Poppins, sans-serif',
    googleFont: 'Poppins:wght@300;400;500;600;700',
    preview: 'Friendly and approachable'
  },

  // Handwritten Fonts
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    category: 'handwritten',
    fontFamily: '"Dancing Script", cursive',
    googleFont: 'Dancing+Script:wght@400;500;600;700',
    preview: 'Casual and flowing handwriting'
  },
  {
    id: 'kalam',
    name: 'Kalam',
    category: 'handwritten',
    fontFamily: 'Kalam, cursive',
    googleFont: 'Kalam:wght@300;400;700',
    preview: 'Natural handwritten feel'
  },
  {
    id: 'caveat',
    name: 'Caveat',
    category: 'handwritten',
    fontFamily: 'Caveat, cursive',
    googleFont: 'Caveat:wght@400;500;600;700',
    preview: 'Personal and intimate writing'
  },

  // Calligraphy Fonts
  {
    id: 'great-vibes',
    name: 'Great Vibes',
    category: 'calligraphy',
    fontFamily: '"Great Vibes", cursive',
    googleFont: 'Great+Vibes',
    preview: 'Elegant script for special moments'
  },
  {
    id: 'allura',
    name: 'Allura',
    category: 'calligraphy',
    fontFamily: 'Allura, cursive',
    googleFont: 'Allura',
    preview: 'Sophisticated calligraphy style'
  },

  // Typewriter Fonts
  {
    id: 'courier-new',
    name: 'Courier New',
    category: 'typewriter',
    fontFamily: '"Courier New", Courier, monospace',
    preview: 'Classic typewriter aesthetic'
  },
  {
    id: 'special-elite',
    name: 'Special Elite',
    category: 'typewriter',
    fontFamily: '"Special Elite", cursive',
    googleFont: 'Special+Elite',
    preview: 'Vintage typewriter charm'
  },
  {
    id: 'american-typewriter',
    name: 'American Typewriter',
    category: 'typewriter',
    fontFamily: '"American Typewriter", serif',
    preview: 'Nostalgic writing experience'
  },

  // Modern Fonts
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'modern',
    fontFamily: 'Montserrat, sans-serif',
    googleFont: 'Montserrat:wght@300;400;500;600;700',
    preview: 'Contemporary and versatile'
  },
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'modern',
    fontFamily: 'Roboto, sans-serif',
    googleFont: 'Roboto:wght@300;400;500;700',
    preview: 'Google\'s signature font'
  },

  // Display Fonts
  {
    id: 'abril-fatface',
    name: 'Abril Fatface',
    category: 'display',
    fontFamily: '"Abril Fatface", cursive',
    googleFont: 'Abril+Fatface',
    preview: 'Bold and expressive'
  }
];

export const FONT_CATEGORIES = [
  { id: 'serif', name: 'Serif', description: 'Traditional and elegant' },
  { id: 'sans-serif', name: 'Sans-serif', description: 'Clean and modern' },
  { id: 'handwritten', name: 'Handwritten', description: 'Personal and casual' },
  { id: 'calligraphy', name: 'Calligraphy', description: 'Artistic and flowing' },
  { id: 'typewriter', name: 'Typewriter', description: 'Vintage and nostalgic' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design' },
  { id: 'display', name: 'Display', description: 'Bold and decorative' }
];
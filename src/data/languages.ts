import { LanguageOption } from '../types/customization';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    fontSupport: ['latin', 'latin-ext'],
    flag: '🇺🇸'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    fontSupport: ['devanagari', 'latin'],
    flag: '🇮🇳'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    direction: 'ltr',
    fontSupport: ['bengali', 'latin'],
    flag: '🇧🇩'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    fontSupport: ['latin', 'latin-ext'],
    flag: '🇪🇸'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    fontSupport: ['latin', 'latin-ext'],
    flag: '🇫🇷'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    fontSupport: ['latin', 'latin-ext'],
    flag: '🇩🇪'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    fontSupport: ['japanese', 'latin'],
    flag: '🇯🇵'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    fontSupport: ['korean', 'latin'],
    flag: '🇰🇷'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    fontSupport: ['chinese-simplified', 'latin'],
    flag: '🇨🇳'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    fontSupport: ['arabic', 'latin'],
    flag: '🇸🇦'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    fontSupport: ['cyrillic', 'latin'],
    flag: '🇷🇺'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    fontSupport: ['latin', 'latin-ext'],
    flag: '🇵🇹'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    fontSupport: ['latin', 'latin-ext'],
    flag: '🇮🇹'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    direction: 'ltr',
    fontSupport: ['tamil', 'latin'],
    flag: '🇮🇳'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    direction: 'ltr',
    fontSupport: ['telugu', 'latin'],
    flag: '🇮🇳'
  }
];

// Multilingual fonts that support various scripts
export const MULTILINGUAL_FONTS = [
  {
    id: 'noto-sans',
    name: 'Noto Sans',
    category: 'sans-serif',
    fontFamily: '"Noto Sans", sans-serif',
    googleFont: 'Noto+Sans:wght@300;400;500;600;700',
    supports: ['latin', 'devanagari', 'bengali', 'tamil', 'telugu', 'arabic', 'cyrillic'],
    preview: 'Universal font for all languages'
  },
  {
    id: 'noto-serif',
    name: 'Noto Serif',
    category: 'serif',
    fontFamily: '"Noto Serif", serif',
    googleFont: 'Noto+Serif:wght@400;500;600;700',
    supports: ['latin', 'devanagari', 'bengali', 'tamil', 'telugu'],
    preview: 'Elegant serif for multilingual text'
  }
];
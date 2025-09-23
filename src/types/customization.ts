export interface FontOption {
  id: string;
  name: string;
  category: 'serif' | 'sans-serif' | 'handwritten' | 'calligraphy' | 'typewriter' | 'modern' | 'display';
  fontFamily: string;
  googleFont?: string;
  preview: string;
  weight?: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  fontSupport: string[];
  flag: string;
}

export interface UserPreferences {
  defaultFont: string;
  defaultLanguage: string;
  perEntryCustomization: boolean;
}

export interface EntryCustomization {
  fontId: string;
  languageCode: string;
  fontSize: number;
  lineHeight: number;
}
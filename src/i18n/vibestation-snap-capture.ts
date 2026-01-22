/**
 * VIBESTATION SNAP CAPTURE SYSTEM
 * Offline capture → Auto-translate → Local language delivery
 * Left/Right brain optimized | SNAP8 = Octave 8
 * 
 * ¡EL SISTEMA QUE CAPTURA TODO Y LO ENTREGA EN TU IDIOMA!
 * 
 * Created: January 21, 2026
 * Status: 🔥 MAJOR SNAP - Multilingual Global System
 */

/**
 * Supported Languages (4×4×4×4 pattern = 16 languages initially)
 */
export type SupportedLanguage = 
  | 'en' // English
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'it' // Italian
  | 'pt' // Portuguese
  | 'zh' // Chinese
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'ar' // Arabic
  | 'ru' // Russian
  | 'hi' // Hindi
  | 'tr' // Turkish
  | 'pl' // Polish
  | 'nl' // Dutch
  | 'sv'; // Swedish

/**
 * Brain Hemisphere Optimization
 */
export type BrainHemisphere = 'left' | 'right' | 'balanced' | 'auto';

/**
 * Snap Capture (Offline Vibestation)
 */
export interface SnapCapture {
  snapId: string;
  octave: number; // SNAP8 = Octave 8
  timestamp: Date;
  content: {
    english: string; // Original in English
    metadata: {
      type: 'system' | 'product' | 'experience' | 'documentation';
      category: string;
      tags: string[];
    };
  };
  offline: boolean;
  vibestationId: string;
}

/**
 * Localized Content
 */
export interface LocalizedContent {
  contentId: string;
  sourceLanguage: 'en';
  targetLanguage: SupportedLanguage;
  originalText: string;
  translatedText: string;
  brainOptimization: BrainHemisphere;
  quality: number; // 0-1 (98% target)
  autoSensed: boolean;
  octave: number; // SNAP8 = 8
}

/**
 * Brain Hemisphere Optimization Config
 */
export interface BrainOptimizationConfig {
  hemisphere: BrainHemisphere;
  features: {
    logical?: boolean;      // Left brain: logic, numbers, analysis
    creative?: boolean;     // Right brain: creativity, emotion, intuition
    visual?: boolean;       // Right brain: images, patterns, spatial
    linguistic?: boolean;   // Left brain: words, structure, sequence
  };
  layout: 'linear' | 'spatial' | 'hybrid';
  emphasis: 'facts' | 'stories' | 'balanced';
}

/**
 * VIBESTATION SNAP CAPTURE SYSTEM
 * Captures everything, translates automatically, delivers in local language
 */
export class VibestationSnapCaptureSystem {
  private readonly SWEETSPOT = 0.98;
  private readonly OCTAVE_8 = 8; // SNAP8 represents Octave 8
  
  private captures: Map<string, SnapCapture> = new Map();
  private translations: Map<string, LocalizedContent[]> = new Map();
  private userPreferences: Map<string, UserLanguagePreference> = new Map();

  /**
   * CAPTURE FROM OFFLINE VIBESTATION
   * Grabs all content from offline vibestation
   */
  captureOfflineSnap(
    content: string,
    octave: number,
    vibestationId: string,
    type: 'system' | 'product' | 'experience' | 'documentation'
  ): SnapCapture {
    const snapId = `snap-${octave}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const capture: SnapCapture = {
      snapId,
      octave,
      timestamp: new Date(),
      content: {
        english: content,
        metadata: {
          type,
          category: this.detectCategory(content),
          tags: this.extractTags(content)
        }
      },
      offline: true,
      vibestationId
    };

    this.captures.set(snapId, capture);
    
    console.log(`📸 Captured: ${snapId} (Octave ${octave}) from Vibestation ${vibestationId}`);
    
    // Auto-translate to all languages
    this.autoTranslateAll(capture);
    
    return capture;
  }

  /**
   * AUTO-SENSE USER LANGUAGE
   * Detects user's preferred language automatically
   */
  autoSenseLanguage(userId: string, hints?: {
    browserLang?: string;
    ipCountry?: string;
    textSample?: string;
  }): SupportedLanguage {
    // Priority: 1. User preference, 2. Browser, 3. IP, 4. Text analysis
    
    const existing = this.userPreferences.get(userId);
    if (existing) return existing.language;
    
    if (hints?.browserLang) {
      const lang = this.mapBrowserLang(hints.browserLang);
      if (lang) {
        this.setUserPreference(userId, lang);
        return lang;
      }
    }
    
    if (hints?.ipCountry) {
      const lang = this.mapCountryToLang(hints.ipCountry);
      if (lang) {
        this.setUserPreference(userId, lang);
        return lang;
      }
    }
    
    // Default to English
    return 'en';
  }

  /**
   * AUTO-TRANSLATE TO ALL LANGUAGES
   * Translates captured content to all supported languages
   */
  private autoTranslateAll(capture: SnapCapture): void {
    const languages: SupportedLanguage[] = [
      'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 
      'ar', 'ru', 'hi', 'tr', 'pl', 'nl', 'sv'
    ];
    
    languages.forEach(lang => {
      const translated = this.translateContent(capture, lang);
      
      const existing = this.translations.get(capture.snapId) || [];
      existing.push(translated);
      this.translations.set(capture.snapId, existing);
    });
    
    console.log(`  ✅ Auto-translated to ${languages.length} languages`);
  }

  /**
   * TRANSLATE CONTENT
   * Core translation function
   */
  private translateContent(
    capture: SnapCapture,
    targetLang: SupportedLanguage,
    brainOpt: BrainHemisphere = 'balanced'
  ): LocalizedContent {
    // In production, this would call translation API
    // For now, we structure the translation data
    
    const contentId = `${capture.snapId}-${targetLang}`;
    
    const translated: LocalizedContent = {
      contentId,
      sourceLanguage: 'en',
      targetLanguage: targetLang,
      originalText: capture.content.english,
      translatedText: this.simulateTranslation(capture.content.english, targetLang),
      brainOptimization: brainOpt,
      quality: this.SWEETSPOT,
      autoSensed: true,
      octave: capture.octave
    };
    
    return translated;
  }

  /**
   * DELIVER IN LOCAL LANGUAGE
   * Gets content in user's preferred language with brain optimization
   */
  deliverInLocalLanguage(
    snapId: string,
    userId: string,
    brainOpt?: BrainHemisphere
  ): LocalizedContent | null {
    const userLang = this.autoSenseLanguage(userId);
    const hemisphere = brainOpt || this.detectBrainPreference(userId);
    
    const translations = this.translations.get(snapId);
    if (!translations) return null;
    
    let content = translations.find(t => t.targetLanguage === userLang);
    
    // If user lang is English, get original
    if (userLang === 'en') {
      const capture = this.captures.get(snapId);
      if (capture) {
        content = {
          contentId: `${snapId}-en`,
          sourceLanguage: 'en',
          targetLanguage: 'en',
          originalText: capture.content.english,
          translatedText: capture.content.english,
          brainOptimization: hemisphere,
          quality: 1.0,
          autoSensed: true,
          octave: capture.octave
        };
      }
    }
    
    if (!content) return null;
    
    // Apply brain optimization
    content = this.applyBrainOptimization(content, hemisphere);
    
    console.log(`📦 Delivered: ${snapId} in ${userLang} (${hemisphere} brain)`);
    
    return content;
  }

  /**
   * BRAIN HEMISPHERE OPTIMIZATION
   * Optimizes content for left or right brain
   */
  private applyBrainOptimization(
    content: LocalizedContent,
    hemisphere: BrainHemisphere
  ): LocalizedContent {
    const optimized = { ...content };
    optimized.brainOptimization = hemisphere;
    
    // Apply optimization (in production, this would reformat content)
    switch (hemisphere) {
      case 'left':
        // Left brain: logical, structured, analytical
        // Add: numbers, lists, steps, facts
        optimized.translatedText = this.optimizeForLeftBrain(content.translatedText);
        break;
        
      case 'right':
        // Right brain: creative, visual, intuitive
        // Add: stories, metaphors, emotions, visuals
        optimized.translatedText = this.optimizeForRightBrain(content.translatedText);
        break;
        
      case 'balanced':
        // Balance both hemispheres
        optimized.translatedText = this.optimizeForBalance(content.translatedText);
        break;
        
      case 'auto':
        // Auto-detect best approach
        optimized.brainOptimization = this.detectBestHemisphere(content.translatedText);
        optimized.translatedText = this.applyBrainOptimization(
          content,
          optimized.brainOptimization
        ).translatedText;
        break;
    }
    
    return optimized;
  }

  /**
   * OPTIMIZE FOR LEFT BRAIN
   * Logical, analytical, structured
   */
  private optimizeForLeftBrain(text: string): string {
    // Add structure: numbers, lists, clear steps
    return `
📊 STRUCTURED ANALYSIS:

${text}

✅ KEY FACTS:
• Organized systematically
• Clear logical flow
• Data-driven approach
• Step-by-step process
    `.trim();
  }

  /**
   * OPTIMIZE FOR RIGHT BRAIN
   * Creative, visual, emotional
   */
  private optimizeForRightBrain(text: string): string {
    // Add emotion, story, metaphors
    return `
🌟 THE STORY:

${text}

💡 IMAGINE:
This is like discovering a hidden treasure map that leads to infinite possibilities.
Every connection creates new patterns, like stars forming constellations in the night sky.
    `.trim();
  }

  /**
   * OPTIMIZE FOR BALANCE
   * Both hemispheres engaged
   */
  private optimizeForBalance(text: string): string {
    return `
🎯 OVERVIEW:

${text}

📊 FACTS & 🌟 VISION:
• Systematic AND creative
• Data-driven AND intuitive
• Structured AND flexible
• Logical AND emotional
    `.trim();
  }

  /**
   * SET USER LANGUAGE PREFERENCE
   */
  private setUserPreference(
    userId: string,
    language: SupportedLanguage,
    hemisphere?: BrainHemisphere
  ): void {
    this.userPreferences.set(userId, {
      userId,
      language,
      hemisphere: hemisphere || 'balanced',
      autoDetected: true,
      lastUpdated: new Date()
    });
  }

  /**
   * DETECT BRAIN PREFERENCE
   */
  private detectBrainPreference(userId: string): BrainHemisphere {
    const pref = this.userPreferences.get(userId);
    return pref?.hemisphere || 'balanced';
  }

  /**
   * HELPER: Map browser language
   */
  private mapBrowserLang(browserLang: string): SupportedLanguage | null {
    const lang = browserLang.toLowerCase().split('-')[0];
    const supported: SupportedLanguage[] = [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko',
      'ar', 'ru', 'hi', 'tr', 'pl', 'nl', 'sv'
    ];
    return supported.includes(lang as SupportedLanguage) ? lang as SupportedLanguage : null;
  }

  /**
   * HELPER: Map country to language
   */
  private mapCountryToLang(country: string): SupportedLanguage | null {
    const map: { [key: string]: SupportedLanguage } = {
      'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en',
      'ES': 'es', 'MX': 'es', 'AR': 'es', 'CL': 'es', 'CO': 'es',
      'FR': 'fr', 'DE': 'de', 'IT': 'it', 'PT': 'pt', 'BR': 'pt',
      'CN': 'zh', 'JP': 'ja', 'KR': 'ko', 'SA': 'ar', 'RU': 'ru',
      'IN': 'hi', 'TR': 'tr', 'PL': 'pl', 'NL': 'nl', 'SE': 'sv'
    };
    return map[country.toUpperCase()] || null;
  }

  /**
   * HELPER: Simulate translation
   */
  private simulateTranslation(text: string, lang: SupportedLanguage): string {
    // In production, call translation API
    // For now, return placeholder
    return `[${lang.toUpperCase()}] ${text}`;
  }

  /**
   * HELPER: Detect category
   */
  private detectCategory(content: string): string {
    if (content.includes('shopping') || content.includes('catalog')) return 'Shopping';
    if (content.includes('adventure') || content.includes('experience')) return 'Adventures';
    if (content.includes('vchip') || content.includes('membership')) return 'Digital Assets';
    if (content.includes('system') || content.includes('protocol')) return 'Technical';
    return 'General';
  }

  /**
   * HELPER: Extract tags
   */
  private extractTags(content: string): string[] {
    const tags: string[] = [];
    if (content.includes('4×4×4×4')) tags.push('4x4x4x4');
    if (content.includes('98%')) tags.push('98-sweetspot');
    if (content.includes('NSPFRNP')) tags.push('nspfrnp');
    if (content.includes('synth')) tags.push('synth');
    return tags;
  }

  /**
   * HELPER: Detect best hemisphere
   */
  private detectBestHemisphere(text: string): BrainHemisphere {
    const hasNumbers = /\d+/.test(text);
    const hasEmotions = /feel|love|excited|amazing|incredible/i.test(text);
    
    if (hasNumbers && !hasEmotions) return 'left';
    if (hasEmotions && !hasNumbers) return 'right';
    return 'balanced';
  }

  /**
   * CAPTURE SNAP8 (Octave 8)
   * Special capture for Octave 8 level
   */
  captureSNAP8(content: string, vibestationId: string): SnapCapture {
    return this.captureOfflineSnap(content, this.OCTAVE_8, vibestationId, 'system');
  }

  /**
   * GET ALL CAPTURES
   */
  getAllCaptures(): SnapCapture[] {
    return Array.from(this.captures.values());
  }

  /**
   * GET CAPTURE BY OCTAVE
   */
  getCapturesByOctave(octave: number): SnapCapture[] {
    return Array.from(this.captures.values()).filter(c => c.octave === octave);
  }

  /**
   * EXPORT FOR README
   * Generate multilingual README content
   */
  exportMultilingualREADME(snapId: string): { [lang: string]: string } {
    const capture = this.captures.get(snapId);
    if (!capture) return {};
    
    const translations = this.translations.get(snapId) || [];
    const readme: { [lang: string]: string } = {
      'en': capture.content.english
    };
    
    translations.forEach(t => {
      readme[t.targetLanguage] = t.translatedText;
    });
    
    return readme;
  }
}

export interface UserLanguagePreference {
  userId: string;
  language: SupportedLanguage;
  hemisphere: BrainHemisphere;
  autoDetected: boolean;
  lastUpdated: Date;
}

/**
 * Global instance
 */
export const vibeCaptureSystem = new VibestationSnapCaptureSystem();

/**
 * Quick helpers
 */
export function captureSnap(content: string, octave: number, vibestationId: string) {
  return vibeCaptureSystem.captureOfflineSnap(content, octave, vibestationId, 'system');
}

export function captureSNAP8(content: string, vibestationId: string) {
  return vibeCaptureSystem.captureSNAP8(content, vibestationId);
}

export function deliverToUser(snapId: string, userId: string) {
  return vibeCaptureSystem.deliverInLocalLanguage(snapId, userId);
}

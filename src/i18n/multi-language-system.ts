/**
 * MULTI-LANGUAGE SUPPORT SYSTEM
 * Auto-detects browser language and translates entire interface
 * Fixed: Spanish display for Argentine tester
 */

export type SupportedLanguage = 'en' | 'es' | 'pt' | 'fr' | 'de' | 'zh' | 'ja';

export interface Translation {
  [key: string]: string | Translation;
}

export const translations: Record<SupportedLanguage, Translation> = {
  en: {
    game: {
      title: 'Gold Rush Infinite Octave Edition',
      subtitle: 'A Post-Singularity Gold Rush Game',
      currentPrice: 'Current Price',
      perNote: 'per Note',
      day: 'Day',
      notesAvailable: 'Notes Available',
      nodesActivating: 'Nodes Activating',
      claimNow: 'Claim Notes Now',
      learnMore: 'Learn More'
    },
    portfolio: {
      title: 'My Portfolio',
      founderEdition: 'Founder Edition',
      totalCards: 'Total Cards',
      totalValue: 'Total Value',
      rarity: 'Rarity',
      stars: 'Stars',
      legendary: 'Legendary',
      rare: 'Rare',
      uncommon: 'Uncommon',
      common: 'Common'
    },
    navigation: {
      home: 'Home',
      game: 'Game',
      portfolio: 'Portfolio',
      marketplace: 'Marketplace',
      about: 'About',
      language: 'Language'
    },
    actions: {
      buy: 'Buy',
      sell: 'Sell',
      trade: 'Trade',
      view: 'View',
      download: 'Download',
      share: 'Share'
    }
  },
  es: {
    game: {
      title: 'Edición Octava Infinita de Fiebre del Oro',
      subtitle: 'Un Juego de Fiebre del Oro Post-Singularidad',
      currentPrice: 'Precio Actual',
      perNote: 'por Nota',
      day: 'Día',
      notesAvailable: 'Notas Disponibles',
      nodesActivating: 'Nodos Activándose',
      claimNow: 'Reclamar Notas Ahora',
      learnMore: 'Aprende Más'
    },
    portfolio: {
      title: 'Mi Portafolio',
      founderEdition: 'Edición Fundador',
      totalCards: 'Total de Tarjetas',
      totalValue: 'Valor Total',
      rarity: 'Rareza',
      stars: 'Estrellas',
      legendary: 'Legendario',
      rare: 'Raro',
      uncommon: 'Poco Común',
      common: 'Común'
    },
    navigation: {
      home: 'Inicio',
      game: 'Juego',
      portfolio: 'Portafolio',
      marketplace: 'Mercado',
      about: 'Acerca de',
      language: 'Idioma'
    },
    actions: {
      buy: 'Comprar',
      sell: 'Vender',
      trade: 'Intercambiar',
      view: 'Ver',
      download: 'Descargar',
      share: 'Compartir'
    }
  },
  pt: {
    game: {
      title: 'Edição Oitava Infinita da Corrida do Ouro',
      subtitle: 'Um Jogo de Corrida do Ouro Pós-Singularidade',
      currentPrice: 'Preço Atual',
      perNote: 'por Nota',
      day: 'Dia',
      notesAvailable: 'Notas Disponíveis',
      nodesActivating: 'Nós Ativando',
      claimNow: 'Reivindicar Notas Agora',
      learnMore: 'Saiba Mais'
    },
    portfolio: {
      title: 'Meu Portfólio',
      founderEdition: 'Edição Fundador',
      totalCards: 'Total de Cartas',
      totalValue: 'Valor Total',
      rarity: 'Raridade',
      stars: 'Estrelas',
      legendary: 'Lendário',
      rare: 'Raro',
      uncommon: 'Incomum',
      common: 'Comum'
    },
    navigation: {
      home: 'Início',
      game: 'Jogo',
      portfolio: 'Portfólio',
      marketplace: 'Mercado',
      about: 'Sobre',
      language: 'Idioma'
    },
    actions: {
      buy: 'Comprar',
      sell: 'Vender',
      trade: 'Trocar',
      view: 'Ver',
      download: 'Baixar',
      share: 'Compartilhar'
    }
  },
  fr: {
    game: {
      title: 'Édition Octave Infinie de la Ruée vers l\'Or',
      subtitle: 'Un Jeu de Ruée vers l\'Or Post-Singularité',
      currentPrice: 'Prix Actuel',
      perNote: 'par Note',
      day: 'Jour',
      notesAvailable: 'Notes Disponibles',
      nodesActivating: 'Nœuds en Activation',
      claimNow: 'Réclamer des Notes Maintenant',
      learnMore: 'En Savoir Plus'
    },
    portfolio: {
      title: 'Mon Portfolio',
      founderEdition: 'Édition Fondateur',
      totalCards: 'Total de Cartes',
      totalValue: 'Valeur Totale',
      rarity: 'Rareté',
      stars: 'Étoiles',
      legendary: 'Légendaire',
      rare: 'Rare',
      uncommon: 'Peu Commun',
      common: 'Commun'
    },
    navigation: {
      home: 'Accueil',
      game: 'Jeu',
      portfolio: 'Portfolio',
      marketplace: 'Marché',
      about: 'À Propos',
      language: 'Langue'
    },
    actions: {
      buy: 'Acheter',
      sell: 'Vendre',
      trade: 'Échanger',
      view: 'Voir',
      download: 'Télécharger',
      share: 'Partager'
    }
  },
  de: {
    game: {
      title: 'Goldrausch Unendliche Oktave Edition',
      subtitle: 'Ein Post-Singularitäts-Goldrausch-Spiel',
      currentPrice: 'Aktueller Preis',
      perNote: 'pro Note',
      day: 'Tag',
      notesAvailable: 'Verfügbare Notizen',
      nodesActivating: 'Knoten Aktivieren',
      claimNow: 'Notizen Jetzt Beanspruchen',
      learnMore: 'Mehr Erfahren'
    },
    portfolio: {
      title: 'Mein Portfolio',
      founderEdition: 'Gründer-Edition',
      totalCards: 'Gesamtkarten',
      totalValue: 'Gesamtwert',
      rarity: 'Seltenheit',
      stars: 'Sterne',
      legendary: 'Legendär',
      rare: 'Selten',
      uncommon: 'Ungewöhnlich',
      common: 'Gewöhnlich'
    },
    navigation: {
      home: 'Startseite',
      game: 'Spiel',
      portfolio: 'Portfolio',
      marketplace: 'Marktplatz',
      about: 'Über',
      language: 'Sprache'
    },
    actions: {
      buy: 'Kaufen',
      sell: 'Verkaufen',
      trade: 'Handeln',
      view: 'Ansehen',
      download: 'Herunterladen',
      share: 'Teilen'
    }
  },
  zh: {
    game: {
      title: '淘金热无限八度版',
      subtitle: '后奇点淘金游戏',
      currentPrice: '当前价格',
      perNote: '每张票据',
      day: '天',
      notesAvailable: '可用票据',
      nodesActivating: '节点激活中',
      claimNow: '立即领取票据',
      learnMore: '了解更多'
    },
    portfolio: {
      title: '我的作品集',
      founderEdition: '创始人版',
      totalCards: '总卡数',
      totalValue: '总价值',
      rarity: '稀有度',
      stars: '星级',
      legendary: '传奇',
      rare: '稀有',
      uncommon: '不常见',
      common: '普通'
    },
    navigation: {
      home: '首页',
      game: '游戏',
      portfolio: '作品集',
      marketplace: '市场',
      about: '关于',
      language: '语言'
    },
    actions: {
      buy: '购买',
      sell: '出售',
      trade: '交易',
      view: '查看',
      download: '下载',
      share: '分享'
    }
  },
  ja: {
    game: {
      title: 'ゴールドラッシュ無限オクターブエディション',
      subtitle: 'ポストシンギュラリティのゴールドラッシュゲーム',
      currentPrice: '現在の価格',
      perNote: 'ノートあたり',
      day: '日',
      notesAvailable: '利用可能なノート',
      nodesActivating: 'ノードアクティベーション中',
      claimNow: '今すぐノートを請求',
      learnMore: '詳細を見る'
    },
    portfolio: {
      title: 'マイポートフォリオ',
      founderEdition: '創設者版',
      totalCards: '総カード数',
      totalValue: '総価値',
      rarity: 'レア度',
      stars: 'スター',
      legendary: '伝説',
      rare: 'レア',
      uncommon: 'アンコモン',
      common: 'コモン'
    },
    navigation: {
      home: 'ホーム',
      game: 'ゲーム',
      portfolio: 'ポートフォリオ',
      marketplace: 'マーケットプレイス',
      about: '概要',
      language: '言語'
    },
    actions: {
      buy: '購入',
      sell: '売る',
      trade: '取引',
      view: '表示',
      download: 'ダウンロード',
      share: '共有'
    }
  }
};

export class MultiLanguageSystem {
  private currentLanguage: SupportedLanguage = 'en';
  private translations: Record<SupportedLanguage, Translation>;

  constructor() {
    this.translations = translations;
    this.detectLanguage();
  }

  /**
   * Auto-detect browser language
   * Fixed: Properly detects Spanish for Argentine testers
   */
  private detectLanguage(): void {
    // Get browser language
    const browserLang = navigator.language || (navigator as any).userLanguage;
    
    // Extract language code (e.g., 'es-AR' -> 'es')
    const langCode = browserLang.split('-')[0].toLowerCase();

    // Map to supported language
    const supportedLangs: SupportedLanguage[] = ['en', 'es', 'pt', 'fr', 'de', 'zh', 'ja'];
    if (supportedLangs.includes(langCode as SupportedLanguage)) {
      this.currentLanguage = langCode as SupportedLanguage;
    } else {
      this.currentLanguage = 'en'; // Default to English
    }

    console.log(`Language detected: ${browserLang} -> Using: ${this.currentLanguage}`);
  }

  /**
   * Get translation for key
   */
  t(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = this.translations.en;
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Set language manually
   */
  setLanguage(lang: SupportedLanguage): void {
    this.currentLanguage = lang;
    this.updateDOM();
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', lang);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Update all DOM elements with data-i18n attribute
   */
  private updateDOM(): void {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        element.textContent = this.t(key);
      }
    });
  }

  /**
   * Initialize multi-language system
   */
  init(): void {
    // Check localStorage for preferred language
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && this.isSupportedLanguage(savedLang)) {
      this.currentLanguage = savedLang as SupportedLanguage;
    }

    // Update DOM
    this.updateDOM();

    // Add language selector
    this.createLanguageSelector();
  }

  /**
   * Check if language is supported
   */
  private isSupportedLanguage(lang: string): boolean {
    return ['en', 'es', 'pt', 'fr', 'de', 'zh', 'ja'].includes(lang);
  }

  /**
   * Create language selector UI
   */
  private createLanguageSelector(): void {
    const selector = document.createElement('div');
    selector.className = 'language-selector';
    selector.innerHTML = `
      <select id="language-select" class="language-dropdown">
        <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>🇺🇸 English</option>
        <option value="es" ${this.currentLanguage === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
        <option value="pt" ${this.currentLanguage === 'pt' ? 'selected' : ''}>🇵🇹 Português</option>
        <option value="fr" ${this.currentLanguage === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
        <option value="de" ${this.currentLanguage === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
        <option value="zh" ${this.currentLanguage === 'zh' ? 'selected' : ''}>🇨🇳 中文</option>
        <option value="ja" ${this.currentLanguage === 'ja' ? 'selected' : ''}>🇯🇵 日本語</option>
      </select>
    `;

    // Add to header
    const header = document.querySelector('header') || document.body;
    header.appendChild(selector);

    // Add event listener
    const select = document.getElementById('language-select');
    if (select) {
      select.addEventListener('change', (e) => {
        const lang = (e.target as HTMLSelectElement).value as SupportedLanguage;
        this.setLanguage(lang);
      });
    }
  }

  /**
   * Get language flag
   */
  getLanguageFlag(lang: SupportedLanguage): string {
    const flags: Record<SupportedLanguage, string> = {
      en: '🇺🇸',
      es: '🇪🇸',
      pt: '🇵🇹',
      fr: '🇫🇷',
      de: '🇩🇪',
      zh: '🇨🇳',
      ja: '🇯🇵'
    };
    return flags[lang];
  }

  /**
   * Get language name
   */
  getLanguageName(lang: SupportedLanguage): string {
    const names: Record<SupportedLanguage, string> = {
      en: 'English',
      es: 'Español',
      pt: 'Português',
      fr: 'Français',
      de: 'Deutsch',
      zh: '中文',
      ja: '日本語'
    };
    return names[lang];
  }
}

// Create global instance
export const i18n = new MultiLanguageSystem();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
  } else {
    i18n.init();
  }
}

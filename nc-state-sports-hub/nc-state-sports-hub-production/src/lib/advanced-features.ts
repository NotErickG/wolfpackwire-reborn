// Advanced Features Core Library - Senior Developer Scaffolding
// This provides the foundation architecture for interns to build upon

export interface GameData {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  score: {
    home: number;
    away: number;
  };
  status: 'upcoming' | 'live' | 'completed';
  quarter?: number;
  timeRemaining?: string;
  venue: string;
  date: Date;
  sport: 'football' | 'basketball' | 'baseball' | 'soccer';
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface Player {
  id: string;
  name: string;
  position: string;
  jersey: number;
  sport: string;
  year: 'FR' | 'SO' | 'JR' | 'SR' | 'GR';
  height: string;
  weight: string;
  hometown: string;
  stats?: PlayerStats;
  photo?: string;
}

export interface PlayerStats {
  season: {
    gamesPlayed: number;
    [key: string]: number | string;
  };
  career: {
    [key: string]: number | string;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  category: string;
  tags: string[];
  imageUrl?: string;
  url: string;
}

// Real-time notification system
export class NotificationService {
  private static instance: NotificationService;
  private subscribers: Map<string, Function[]> = new Map();

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  subscribe(event: string, callback: Function): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);
  }

  unsubscribe(event: string, callback: Function): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Score update notifications
  notifyScoreUpdate(game: GameData): void {
    this.emit('score-update', game);
    
    // Browser notification if permissions granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`NC State ${game.sport.toUpperCase()}`, {
        body: `${game.homeTeam.shortName} ${game.score.home} - ${game.awayTeam.shortName} ${game.score.away}`,
        icon: '/assets/nc-state-logo.png',
        tag: `game-${game.id}`,
      });
    }
  }
}

// Advanced search and filtering
export class SearchEngine {
  private static stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];

  static tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.includes(word));
  }

  static searchArticles(articles: NewsArticle[], query: string): NewsArticle[] {
    const tokens = this.tokenize(query);
    
    return articles
      .map(article => {
        const titleTokens = this.tokenize(article.title);
        const contentTokens = this.tokenize(article.excerpt);
        
        let score = 0;
        tokens.forEach(token => {
          // Title matches are worth more
          if (titleTokens.some(t => t.includes(token))) score += 3;
          if (contentTokens.some(t => t.includes(token))) score += 1;
          if (article.tags.some(tag => tag.toLowerCase().includes(token))) score += 2;
        });
        
        return { article, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => result.article);
  }

  static searchPlayers(players: Player[], query: string): Player[] {
    const searchTerm = query.toLowerCase();
    
    return players.filter(player => 
      player.name.toLowerCase().includes(searchTerm) ||
      player.position.toLowerCase().includes(searchTerm) ||
      player.hometown.toLowerCase().includes(searchTerm) ||
      player.sport.toLowerCase().includes(searchTerm)
    );
  }
}

// Performance monitoring and analytics
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
    
    // Keep only last 100 measurements
    if (this.metrics.get(name)!.length > 100) {
      this.metrics.get(name)!.shift();
    }
  }

  static getAverage(name: string): number {
    const values = this.metrics.get(name) || [];
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  static measureComponentRender<T extends (...args: any[]) => any>(Component: T): T {
    return ((...args: any[]) => {
      const start = performance.now();
      const result = Component(...args);
      const end = performance.now();
      
      this.recordMetric(`${Component.name || 'Component'}-render`, end - start);
      return result;
    }) as T;
  }
}

// Real-time data synchronization
export class DataSync {
  private static wsConnection: WebSocket | null = null;
  private static reconnectAttempts = 0;
  private static maxReconnectAttempts = 5;

  static connect(): void {
    // Mock WebSocket connection for real-time updates
    // In production, this would connect to a WebSocket server
    console.log('DataSync: Establishing real-time connection...');
    
    // Simulate real-time score updates
    setInterval(() => {
      const mockGame: GameData = {
        id: 'mock-game-1',
        homeTeam: { id: 'ncstate', name: 'NC State Wolfpack', shortName: 'NCST', logo: '/assets/ncstate-logo.png', colors: { primary: '#CC0000', secondary: '#FFFFFF' } },
        awayTeam: { id: 'opponent', name: 'Opponent', shortName: 'OPP', logo: '/assets/opponent-logo.png', colors: { primary: '#000000', secondary: '#FFFFFF' } },
        score: { home: Math.floor(Math.random() * 100), away: Math.floor(Math.random() * 100) },
        status: 'live',
        quarter: 2,
        timeRemaining: '5:30',
        venue: 'PNC Arena',
        date: new Date(),
        sport: 'basketball'
      };
      
      NotificationService.getInstance().notifyScoreUpdate(mockGame);
    }, 30000); // Update every 30 seconds
  }

  static disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }
}

// Theme and accessibility management
export class ThemeManager {
  private static currentTheme: 'light' | 'dark' | 'auto' = 'auto';
  private static listeners: Function[] = [];

  static setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.currentTheme = theme;
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.applyTheme(theme);
    }
    
    localStorage.setItem('nc-state-theme', theme);
    this.listeners.forEach(listener => listener(theme));
  }

  private static applyTheme(theme: 'light' | 'dark'): void {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }

  static getTheme(): 'light' | 'dark' | 'auto' {
    return this.currentTheme;
  }

  static onThemeChange(callback: Function): void {
    this.listeners.push(callback);
  }

  static init(): void {
    const savedTheme = localStorage.getItem('nc-state-theme') as 'light' | 'dark' | 'auto' || 'auto';
    this.setTheme(savedTheme);
  }
}

// Cache management for better performance
export class CacheManager {
  private static cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  static set(key: string, data: any, ttl: number = 300000): void { // 5 minute default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    entries.forEach(([key, item]) => {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    });
  }
}

// Initialize services
export const initializeAdvancedFeatures = (): void => {
  ThemeManager.init();
  DataSync.connect();
  
  // Cleanup cache every 5 minutes
  setInterval(() => CacheManager.cleanup(), 300000);
  
  // Request notification permissions
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

export default {
  NotificationService,
  SearchEngine,
  PerformanceMonitor,
  DataSync,
  ThemeManager,
  CacheManager,
  initializeAdvancedFeatures
};
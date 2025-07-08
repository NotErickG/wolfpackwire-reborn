// Advanced React Hooks - Senior Developer Scaffolding
// These hooks provide the foundation for interns to build advanced features

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameData, Player, NewsArticle, NotificationService, SearchEngine, CacheManager } from '../lib/advanced-features';

// Real-time game data hook
export const useRealTimeScores = () => {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    
    const handleScoreUpdate = (game: GameData) => {
      setGames(prevGames => {
        const updatedGames = [...prevGames];
        const existingIndex = updatedGames.findIndex(g => g.id === game.id);
        
        if (existingIndex >= 0) {
          updatedGames[existingIndex] = game;
        } else {
          updatedGames.push(game);
        }
        
        return updatedGames;
      });
    };

    notificationService.subscribe('score-update', handleScoreUpdate);

    // Initial data fetch
    const fetchGames = async () => {
      try {
        setLoading(true);
        // Check cache first
        const cachedGames = CacheManager.get('nc-state-games');
        if (cachedGames) {
          setGames(cachedGames);
          setLoading(false);
          return;
        }

        // Mock API call - interns will replace with real ESPN API
        const response = await fetch('/api/games/ncstate');
        if (!response.ok) throw new Error('Failed to fetch games');
        
        const gameData = await response.json();
        setGames(gameData);
        CacheManager.set('nc-state-games', gameData, 300000); // 5 min cache
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

    return () => {
      notificationService.unsubscribe('score-update', handleScoreUpdate);
    };
  }, []);

  return { games, loading, error, refresh: () => window.location.reload() };
};

// Advanced search hook with debouncing
export const useAdvancedSearch = <T>(
  items: T[],
  searchFunction: (items: T[], query: string) => T[],
  delay: number = 300
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>(items);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSearch = useCallback((searchQuery: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSearching(true);
    timeoutRef.current = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setResults(items);
      } else {
        const searchResults = searchFunction(items, searchQuery);
        setResults(searchResults);
      }
      setIsSearching(false);
    }, delay);
  }, [items, searchFunction, delay]);

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debouncedSearch]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch: () => setQuery('')
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCountRef = useRef(0);
  const startTimeRef = useRef<number>();

  useEffect(() => {
    renderCountRef.current += 1;
    startTimeRef.current = performance.now();

    return () => {
      if (startTimeRef.current) {
        const endTime = performance.now();
        const renderTime = endTime - startTimeRef.current;
        
        // Log performance metrics (interns can enhance this)
        console.log(`${componentName} render #${renderCountRef.current}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return {
    renderCount: renderCountRef.current,
    recordMetric: (name: string, value: number) => {
      console.log(`${componentName} - ${name}: ${value}`);
    }
  };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  threshold: number = 0.1,
  rootMargin: string = '0px'
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasIntersected(true);
        }
      },
      { threshold, rootMargin }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { targetRef, isIntersecting, hasIntersected };
};

// Local storage hook with type safety
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// Optimistic updates hook
export const useOptimisticUpdates = <T>(
  initialData: T[],
  updateFunction: (item: T) => Promise<T>
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  const optimisticUpdate = useCallback(async (item: T, itemId: string) => {
    // Immediately update UI
    setData(prevData => prevData.map(d => 
      // Interns will need to implement proper ID comparison
      JSON.stringify(d) === JSON.stringify(item) ? item : d
    ));
    
    setPendingUpdates(prev => new Set(prev).add(itemId));

    try {
      const updatedItem = await updateFunction(item);
      // Replace optimistic update with real data
      setData(prevData => prevData.map(d => 
        JSON.stringify(d) === JSON.stringify(item) ? updatedItem : d
      ));
    } catch (error) {
      // Revert optimistic update on error
      setData(initialData);
      console.error('Optimistic update failed:', error);
    } finally {
      setPendingUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [initialData, updateFunction]);

  return {
    data,
    optimisticUpdate,
    pendingUpdates: Array.from(pendingUpdates)
  };
};

// Virtual scrolling hook for large lists
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
};

// Theme hook
export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'auto'>('nc-state-theme', 'auto');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme = theme === 'auto' ? systemTheme : theme;

  return {
    theme,
    setTheme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark'
  };
};

export default {
  useRealTimeScores,
  useAdvancedSearch,
  usePerformanceMonitor,
  useIntersectionObserver,
  useLocalStorage,
  useOptimisticUpdates,
  useVirtualScrolling,
  useTheme
};
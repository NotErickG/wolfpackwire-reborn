// Utility Helper Functions - Senior Developer Scaffolding
// Common functions that interns will use throughout the application

// Date and time utilities
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const formatGameTime = (timeRemaining: string, quarter: number, sport: string): string => {
  const sportQuarters: { [key: string]: string[] } = {
    basketball: ['1st', '2nd', '1st OT', '2nd OT', '3rd OT'],
    football: ['1st', '2nd', '3rd', '4th', 'OT'],
    baseball: ['Top 1st', 'Bot 1st', 'Top 2nd', 'Bot 2nd', 'Top 3rd', 'Bot 3rd'],
    soccer: ['1st Half', '2nd Half', 'ET 1st', 'ET 2nd']
  };

  const quarters = sportQuarters[sport] || ['Period ' + quarter];
  const quarterText = quarters[quarter - 1] || `Period ${quarter}`;
  
  return timeRemaining ? `${quarterText} - ${timeRemaining}` : quarterText;
};

export const getTimeUntilGame = (gameDate: Date | string): string => {
  const now = new Date();
  const game = new Date(gameDate);
  const diffMs = game.getTime() - now.getTime();
  
  if (diffMs < 0) return 'Game started';
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatPlayerName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

export const formatPlayerHeight = (heightInches: number): string => {
  const feet = Math.floor(heightInches / 12);
  const inches = heightInches % 12;
  return `${feet}'${inches}"`;
};

// Number utilities
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatStat = (stat: number, type: 'percentage' | 'decimal' | 'integer' = 'decimal'): string => {
  switch (type) {
    case 'percentage':
      return formatPercentage(stat);
    case 'integer':
      return Math.round(stat).toString();
    case 'decimal':
    default:
      return stat.toFixed(1);
  }
};

// Color utilities for NC State branding
export const ncStateColors = {
  primary: '#CC0000',
  secondary: '#FFFFFF',
  accent: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

export const getTeamColor = (teamName: string): string => {
  const teamColors: { [key: string]: string } = {
    'NC State': ncStateColors.primary,
    'Wolfpack': ncStateColors.primary,
    'Duke': '#003087',
    'UNC': '#4B9CD3',
    'Wake Forest': '#9E7E38',
    'Virginia Tech': '#861F41',
    'Clemson': '#F56600',
    'Florida State': '#782F40',
    'Miami': '#F47321',
    'Virginia': '#232D4B',
    'Georgia Tech': '#B3A369',
    'Louisville': '#AD0000',
    'Pittsburgh': '#003594',
    'Syracuse': '#F76900',
    'Boston College': '#8B0000'
  };
  
  return teamColors[teamName] || ncStateColors.accent;
};

// URL and navigation utilities
export const buildPlayerUrl = (playerId: string, playerName: string): string => {
  return `/player/${playerId}/${slugify(playerName)}`;
};

export const buildGameUrl = (gameId: string, teams: string): string => {
  return `/game/${gameId}/${slugify(teams)}`;
};

export const buildNewsUrl = (articleId: string, title: string): string => {
  return `/news/${articleId}/${slugify(title)}`;
};

export const getShareUrl = (path: string): string => {
  return `${window.location.origin}${path}`;
};

// Social sharing utilities
export const shareOnTwitter = (text: string, url?: string): void => {
  const shareUrl = url || window.location.href;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=NCState,Wolfpack,GoPackGo`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
};

export const shareOnFacebook = (url?: string): void => {
  const shareUrl = url || window.location.href;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  window.open(facebookUrl, '_blank', 'width=555,height=400');
};

export const shareOnReddit = (title: string, url?: string): void => {
  const shareUrl = url || window.location.href;
  const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
  window.open(redditUrl, '_blank');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (fallbackErr) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

// Image utilities
export const getPlayerImageUrl = (playerId: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  const sizes = {
    small: '100x100',
    medium: '200x200',
    large: '400x400'
  };
  
  return `https://a.espncdn.com/i/headshots/college-football/players/full/${playerId}.png`;
};

export const getTeamLogoUrl = (teamId: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  const sizes = {
    small: '50',
    medium: '100',
    large: '200'
  };
  
  return `https://a.espncdn.com/i/teamlogos/ncaa/500/${teamId}.png`;
};

export const getImagePlaceholder = (width: number, height: number, text?: string): string => {
  const placeholderText = text || `${width}x${height}`;
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${ncStateColors.gray[200]}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="${ncStateColors.gray[500]}" text-anchor="middle" dy=".3em">${placeholderText}</text>
    </svg>
  `)}`;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Local storage utilities with error handling
export const setStorageItem = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to save to localStorage: ${error}`);
    return false;
  }
};

export const getStorageItem = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.warn(`Failed to read from localStorage: ${error}`);
    return defaultValue || null;
  }
};

export const removeStorageItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove from localStorage: ${error}`);
    return false;
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const logError = (error: any, context?: string): void => {
  const errorMessage = handleApiError(error);
  const logContext = context ? `[${context}] ` : '';
  console.error(`${logContext}${errorMessage}`, error);
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with error tracking service (Sentry, etc.)
  }
};

export default {
  // Date/Time
  formatDate,
  formatTime,
  formatGameTime,
  getTimeUntilGame,
  
  // String manipulation
  truncateText,
  slugify,
  capitalizeFirst,
  formatPlayerName,
  formatPlayerHeight,
  
  // Numbers
  formatNumber,
  formatPercentage,
  formatStat,
  
  // Colors/Branding
  ncStateColors,
  getTeamColor,
  
  // URLs
  buildPlayerUrl,
  buildGameUrl,
  buildNewsUrl,
  getShareUrl,
  
  // Social sharing
  shareOnTwitter,
  shareOnFacebook,
  shareOnReddit,
  copyToClipboard,
  
  // Images
  getPlayerImageUrl,
  getTeamLogoUrl,
  getImagePlaceholder,
  
  // Validation
  isValidEmail,
  isValidPhoneNumber,
  sanitizeInput,
  
  // Storage
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  
  // Performance
  debounce,
  throttle,
  
  // Error handling
  handleApiError,
  logError
};
// Global App Context - Senior Developer Scaffolding
// This provides centralized state management for the entire application

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameData, Player, NewsArticle } from '../lib/advanced-features';

// Global state interface
interface AppState {
  // Game data
  games: GameData[];
  selectedGame: GameData | null;
  gameLoading: boolean;
  
  // Player data
  players: Player[];
  selectedPlayer: Player | null;
  playerLoading: boolean;
  
  // News data
  news: NewsArticle[];
  newsLoading: boolean;
  
  // UI state
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  searchQuery: string;
  searchResults: any[];
  
  // User preferences
  favoriteTeams: string[];
  notificationsEnabled: boolean;
  
  // Error handling
  errors: string[];
}

// Action types
type AppAction =
  | { type: 'SET_GAMES'; payload: GameData[] }
  | { type: 'SELECT_GAME'; payload: GameData | null }
  | { type: 'SET_GAME_LOADING'; payload: boolean }
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'SELECT_PLAYER'; payload: Player | null }
  | { type: 'SET_PLAYER_LOADING'; payload: boolean }
  | { type: 'SET_NEWS'; payload: NewsArticle[] }
  | { type: 'SET_NEWS_LOADING'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'auto' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: any[] }
  | { type: 'ADD_FAVORITE_TEAM'; payload: string }
  | { type: 'REMOVE_FAVORITE_TEAM'; payload: string }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'ADD_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'CLEAR_ERROR'; payload: string };

// Initial state
const initialState: AppState = {
  games: [],
  selectedGame: null,
  gameLoading: false,
  players: [],
  selectedPlayer: null,
  playerLoading: false,
  news: [],
  newsLoading: false,
  theme: 'auto',
  sidebarOpen: false,
  searchQuery: '',
  searchResults: [],
  favoriteTeams: ['NC State Wolfpack'],
  notificationsEnabled: true,
  errors: []
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_GAMES':
      return { ...state, games: action.payload, gameLoading: false };
    
    case 'SELECT_GAME':
      return { ...state, selectedGame: action.payload };
    
    case 'SET_GAME_LOADING':
      return { ...state, gameLoading: action.payload };
    
    case 'SET_PLAYERS':
      return { ...state, players: action.payload, playerLoading: false };
    
    case 'SELECT_PLAYER':
      return { ...state, selectedPlayer: action.payload };
    
    case 'SET_PLAYER_LOADING':
      return { ...state, playerLoading: action.payload };
    
    case 'SET_NEWS':
      return { ...state, news: action.payload, newsLoading: false };
    
    case 'SET_NEWS_LOADING':
      return { ...state, newsLoading: action.payload };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    
    case 'ADD_FAVORITE_TEAM':
      if (!state.favoriteTeams.includes(action.payload)) {
        return { ...state, favoriteTeams: [...state.favoriteTeams, action.payload] };
      }
      return state;
    
    case 'REMOVE_FAVORITE_TEAM':
      return { 
        ...state, 
        favoriteTeams: state.favoriteTeams.filter(team => team !== action.payload) 
      };
    
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notificationsEnabled: !state.notificationsEnabled };
    
    case 'ADD_ERROR':
      return { ...state, errors: [...state.errors, action.payload] };
    
    case 'CLEAR_ERRORS':
      return { ...state, errors: [] };
    
    case 'CLEAR_ERROR':
      return { 
        ...state, 
        errors: state.errors.filter(error => error !== action.payload) 
      };
    
    default:
      return state;
  }
};

// Context creation
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved preferences on mount
  useEffect(() => {
    try {
      // Load theme preference
      const savedTheme = localStorage.getItem('nc-state-theme') as 'light' | 'dark' | 'auto';
      if (savedTheme) {
        dispatch({ type: 'SET_THEME', payload: savedTheme });
      }

      // Load favorite teams
      const savedTeams = localStorage.getItem('nc-state-favorite-teams');
      if (savedTeams) {
        const teams = JSON.parse(savedTeams);
        teams.forEach((team: string) => {
          dispatch({ type: 'ADD_FAVORITE_TEAM', payload: team });
        });
      }

      // Load notification preference
      const notificationsEnabled = localStorage.getItem('nc-state-notifications') !== 'false';
      if (!notificationsEnabled) {
        dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
      }
    } catch (error) {
      console.warn('Error loading preferences:', error);
      dispatch({ type: 'ADD_ERROR', payload: 'Failed to load preferences' });
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('nc-state-theme', state.theme);
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem('nc-state-favorite-teams', JSON.stringify(state.favoriteTeams));
  }, [state.favoriteTeams]);

  useEffect(() => {
    localStorage.setItem('nc-state-notifications', String(state.notificationsEnabled));
  }, [state.notificationsEnabled]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Convenience hooks for specific parts of state
export const useGameData = () => {
  const { state, dispatch } = useAppContext();
  
  return {
    games: state.games,
    selectedGame: state.selectedGame,
    loading: state.gameLoading,
    setGames: (games: GameData[]) => dispatch({ type: 'SET_GAMES', payload: games }),
    selectGame: (game: GameData | null) => dispatch({ type: 'SELECT_GAME', payload: game }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_GAME_LOADING', payload: loading })
  };
};

export const usePlayerData = () => {
  const { state, dispatch } = useAppContext();
  
  return {
    players: state.players,
    selectedPlayer: state.selectedPlayer,
    loading: state.playerLoading,
    setPlayers: (players: Player[]) => dispatch({ type: 'SET_PLAYERS', payload: players }),
    selectPlayer: (player: Player | null) => dispatch({ type: 'SELECT_PLAYER', payload: player }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_PLAYER_LOADING', payload: loading })
  };
};

export const useNewsData = () => {
  const { state, dispatch } = useAppContext();
  
  return {
    news: state.news,
    loading: state.newsLoading,
    setNews: (news: NewsArticle[]) => dispatch({ type: 'SET_NEWS', payload: news }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_NEWS_LOADING', payload: loading })
  };
};

export const useAppTheme = () => {
  const { state, dispatch } = useAppContext();
  
  return {
    theme: state.theme,
    setTheme: (theme: 'light' | 'dark' | 'auto') => dispatch({ type: 'SET_THEME', payload: theme })
  };
};

export const useSearchState = () => {
  const { state, dispatch } = useAppContext();
  
  return {
    query: state.searchQuery,
    results: state.searchResults,
    setQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    setResults: (results: any[]) => dispatch({ type: 'SET_SEARCH_RESULTS', payload: results }),
    clearSearch: () => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
    }
  };
};

export const useUserPreferences = () => {
  const { state, dispatch } = useAppContext();
  
  return {
    favoriteTeams: state.favoriteTeams,
    notificationsEnabled: state.notificationsEnabled,
    addFavoriteTeam: (team: string) => dispatch({ type: 'ADD_FAVORITE_TEAM', payload: team }),
    removeFavoriteTeam: (team: string) => dispatch({ type: 'REMOVE_FAVORITE_TEAM', payload: team }),
    toggleNotifications: () => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })
  };
};

export const useErrorHandling = () => {
  const { state, dispatch } = useAppContext();
  
  return {
    errors: state.errors,
    addError: (error: string) => dispatch({ type: 'ADD_ERROR', payload: error }),
    clearErrors: () => dispatch({ type: 'CLEAR_ERRORS' }),
    clearError: (error: string) => dispatch({ type: 'CLEAR_ERROR', payload: error })
  };
};

export default AppContext;
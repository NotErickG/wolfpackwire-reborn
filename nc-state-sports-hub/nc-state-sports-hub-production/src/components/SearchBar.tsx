import React, { useState, useEffect, useRef, useCallback } from 'react';
import { rssService, RSSArticle } from '@/lib/rss-feed';
import { espnAPI, ESPNGame, ESPNAthlete } from '@/lib/espn-api';
import { FaSearch, FaTimes, FaHistory, FaChevronDown, FaSpinner } from 'react-icons/fa';

// Define types for search filters
type Sport = 'All' | 'Basketball' | 'Football' | 'Baseball';
type ContentType = 'All' | 'News' | 'Schedules' | 'Roster';

interface SearchFilters {
  sport: Sport;
  startDate: string;
  endDate: string;
  author: string;
  contentType: ContentType;
}

interface SearchSuggestion {
  type: 'news' | 'game' | 'player';
  id: string;
  title: string;
  link: string;
}

interface SearchBarProps {
  onSearch: (searchTerm: string, filters: SearchFilters) => void;
}

/**
 * SearchBar Component for NC State Sports Hub with advanced filtering,
 * search suggestions, and search history.
 */
export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilters>({
    sport: 'All',
    startDate: '',
    endDate: '',
    author: '',
    contentType: 'All',
  });
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  /**
   * Handles changes to the search input field, debouncing the suggestion fetch.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setError(null); // Clear any previous errors

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (value.length > 2) {
      setLoading(true);
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 500); // 500ms debounce
    } else {
      setSuggestions([]);
      setLoading(false);
      setShowSuggestions(false);
    }
  };

  /**
   * Fetches search suggestions from RSS and ESPN APIs based on the search term.
   */
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query) {
      setSuggestions([]);
      setLoading(false);
      setShowSuggestions(false);
      return;
    }

    try {
      const newsResults: RSSArticle[] = await rssService.searchNews(query);
      const gameResults: ESPNGame[] = await espnAPI.searchGames(query);
      const playerResults: ESPNAthlete[] = await espnAPI.searchPlayers(query);

      const newsSuggestions: SearchSuggestion[] = newsResults.map(item => ({
        type: 'news',
        id: item.id,
        title: item.title,
        link: item.link,
      }));

      const gameSuggestions: SearchSuggestion[] = gameResults.map(game => ({
        type: 'game',
        id: game.id,
        title: game.shortName,
        link: `/games/${game.id}`, // Assuming a game details page
      }));

      const playerSuggestions: SearchSuggestion[] = playerResults.map(player => ({
        type: 'player',
        id: player.id,
        title: player.fullName,
        link: `/players/${player.id}`, // Assuming a player details page
      }));

      // Combine all suggestions (news, games, players)
      const combinedSuggestions = [
        ...newsSuggestions,
        ...gameSuggestions,
        ...playerSuggestions,
      ].slice(0, 10); // Limit to 10 suggestions

      setSuggestions(combinedSuggestions);
      setShowSuggestions(combinedSuggestions.length > 0);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setError('Failed to load suggestions. Please try again.');
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handles the main search submission.
   */
  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim(), filters);
      // Add to history if not already present
      if (!searchHistory.includes(searchTerm.trim())) {
        setSearchHistory(prev => [searchTerm.trim(), ...prev.slice(0, 9)]); // Keep last 10
      }
      setShowSuggestions(false);
      searchInputRef.current?.blur(); // Hide keyboard on mobile
    }
  };

  /**
   * Handles clicking on a search suggestion.
   */
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.title);
    onSearch(suggestion.title, filters); // Perform search with suggested term
    if (!searchHistory.includes(suggestion.title)) {
      setSearchHistory(prev => [suggestion.title, ...prev.slice(0, 9)]);
    }
    setShowSuggestions(false);
    searchInputRef.current?.blur();
    // Optionally navigate to the link: window.location.href = suggestion.link;
  };

  /**
   * Handles clicking on a search history item.
   */
  const handleHistoryClick = (historyItem: string) => {
    setSearchTerm(historyItem);
    onSearch(historyItem, filters);
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  };

  /**
   * Clears the search input and suggestions.
   */
  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    setLoading(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  };

  /**
   * Removes an item from search history.
   */
  const removeHistoryItem = (itemToRemove: string) => {
    setSearchHistory(prev => prev.filter(item => item !== itemToRemove));
  };

  /**
   * Handles filter changes.
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md relative z-10">
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-grow w-full">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search NC State Sports..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-gray-900"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm.length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaSearch className="mr-2" />}
          Search
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

      {/* Search Suggestions / History */}
      {(showSuggestions && suggestions.length > 0) || (searchTerm.length === 0 && searchHistory.length > 0) ? (
        <div
          ref={suggestionBoxRef}
          className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20"
        >
          {showSuggestions && suggestions.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">Suggestions</div>
              {suggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="text-gray-800 truncate">{suggestion.title}</span>
                  <span className="text-xs text-gray-500 capitalize">{suggestion.type}</span>
                </div>
              ))}
            </>
          )}
          {searchTerm.length === 0 && searchHistory.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">Recent Searches</div>
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center flex-grow" onClick={() => handleHistoryClick(item)}>
                    <FaHistory className="text-gray-400 mr-2" />
                    <span className="text-gray-800 truncate">{item}</span>
                  </div>
                  <button
                    onClick={() => removeHistoryItem(item)}
                    className="text-gray-400 hover:text-red-600 ml-2"
                    aria-label={`Remove ${item} from history`}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      ) : null}

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {/* Sport Filter */}
        <div>
          <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
          <div className="relative">
            <select
              id="sport"
              name="sport"
              value={filters.sport}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 sm:text-sm appearance-none pr-8"
            >
              <option value="All">All Sports</option>
              <option value="Basketball">Basketball</option>
              <option value="Football">Football</option>
              <option value="Baseball">Baseball</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Content Type Filter */}
        <div>
          <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
          <div className="relative">
            <select
              id="contentType"
              name="contentType"
              value={filters.contentType}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 sm:text-sm appearance-none pr-8"
            >
              <option value="All">All Types</option>
              <option value="News">News</option>
              <option value="Schedules">Schedules</option>
              <option value="Roster">Roster</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Date Range Filter (Start Date) */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 sm:text-sm"
          />
        </div>

        {/* Date Range Filter (End Date) */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 sm:text-sm"
          />
        </div>

        {/* Author Filter */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            placeholder="e.g., Joe Smith"
            value={filters.author}
            onChange={handleFilterChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 sm:text-sm text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
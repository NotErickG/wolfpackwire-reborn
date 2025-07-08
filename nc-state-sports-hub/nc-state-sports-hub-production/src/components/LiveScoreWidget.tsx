import React, { useState, useEffect } from 'react';
import { espnAPI } from '@/lib/espn-api';

interface LiveScoreWidgetProps {
  sport?: 'basketball' | 'football';
  className?: string;
}

interface LiveGame {
  id: string;
  opponent: {
    name: string;
    logo: string;
    score: number;
  };
  ncState: {
    score: number;
  };
  status: string;
  period: string;
  timeRemaining: string;
  venue: string;
}

/**
 * LiveScoreWidget - Real-time NC State game scores
 * Displays live scores with automatic updates
 */
export default function LiveScoreWidget({ sport = 'basketball', className = '' }: LiveScoreWidgetProps) {
  const [liveGames, setLiveGames] = useState<LiveGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLiveGames = async () => {
    try {
      const games = await espnAPI.getLiveGames(sport);
      const processedGames = games.map(game => {
        const competition = game.competitions[0];
        const opponent = competition.competitors.find(c => c.team.id !== '152');
        const ncState = competition.competitors.find(c => c.team.id === '152');
        
        return {
          id: game.id,
          opponent: {
            name: opponent?.team.shortDisplayName || 'Opponent',
            logo: opponent?.team.logo || '',
            score: parseInt(opponent?.score || '0')
          },
          ncState: {
            score: parseInt(ncState?.score || '0')
          },
          status: competition.status.type.description,
          period: competition.status.period ? `${competition.status.period}${getPeriodSuffix(competition.status.period)}` : '',
          timeRemaining: competition.status.displayClock || '',
          venue: competition.venue?.shortName || ''
        };
      });
      
      setLiveGames(processedGames);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch live games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPeriodSuffix = (period: number): string => {
    if (period === 1) return 'st';
    if (period === 2) return 'nd';
    if (period === 3) return 'rd';
    return 'th';
  };

  useEffect(() => {
    fetchLiveGames();
    
    // Update every 30 seconds during live games
    const interval = setInterval(fetchLiveGames, 30000);
    
    return () => clearInterval(interval);
  }, [sport]);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (liveGames.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
          Live Scores
        </h3>
        <p className="text-gray-600 text-center py-4">
          No live {sport} games at the moment
        </p>
        <p className="text-xs text-gray-400 text-center">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
        Live Scores
      </h3>
      
      <div className="space-y-4">
        {liveGames.map((game) => (
          <div key={game.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
            {/* Game Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm font-medium text-red-600">
                {game.status} {game.period && `• ${game.period}`}
              </div>
              <div className="text-sm text-gray-600">
                {game.timeRemaining}
              </div>
            </div>
            
            {/* Score Display */}
            <div className="flex items-center justify-between">
              {/* NC State */}
              <div className="flex items-center space-x-3">
                <div className="text-xs text-gray-600 font-medium">NC STATE</div>
                <div className="text-2xl font-bold text-red-600">
                  {game.ncState.score}
                </div>
              </div>
              
              {/* VS */}
              <div className="text-gray-400 font-medium">VS</div>
              
              {/* Opponent */}
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-gray-800">
                  {game.opponent.score}
                </div>
                <div className="flex items-center space-x-2">
                  {game.opponent.logo && (
                    <img 
                      src={game.opponent.logo} 
                      alt={game.opponent.name}
                      className="w-6 h-6"
                    />
                  )}
                  <div className="text-xs text-gray-600 font-medium">
                    {game.opponent.name.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Venue */}
            {game.venue && (
              <div className="text-xs text-gray-500 mt-2 text-center">
                {game.venue}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-400 text-center mt-4">
        Updates every 30 seconds • Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
}


'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { espnAPI, ESPNGame } from '../lib/espn-api';
import LoadingSpinner from './LoadingSpinner'; // Assuming this component exists
import ErrorBoundary from './ErrorBoundary'; // Assuming this component exists
import Link from 'next/link'; // For navigation

// Define props for the LiveGameWidget component
interface LiveGameWidgetProps {
  sport: 'football' | 'basketball' | 'baseball';
}

// LiveGameWidget component to display real-time and upcoming NC State sports data
const LiveGameWidget: React.FC<LiveGameWidgetProps> = ({ sport }) => {
  const [liveGames, setLiveGames] = useState<ESPNGame[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<ESPNGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch game data
  const fetchGameData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedLiveGames = await espnAPI.getNCStateLiveGames(sport);
      const fetchedUpcomingGames = await espnAPI.getUpcomingGames(sport);
      setLiveGames(fetchedLiveGames);
      setUpcomingGames(fetchedUpcomingGames);
    } catch (err) {
      console.error(`Failed to fetch ${sport} game data:`, err);
      setError(`Failed to load ${sport} game data. Please try again later.`);
    } finally {
      setLoading(false);
    }
  }, [sport]);

  // useEffect hook to fetch data on component mount and set up auto-refresh
  useEffect(() => {
    fetchGameData(); // Initial fetch

    const interval = setInterval(() => {
      fetchGameData(); // Auto-refresh every 30 seconds
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [sport, fetchGameData]); // Re-run effect if sport or fetchGameData changes

  // Render loading state
  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md text-center">
        <LoadingSpinner />
        <p className="text-gray-600 mt-2">Loading live {sport} data...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  // Helper to format game date
  const formatGameDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <ErrorBoundary>
      <div className="p-4 bg-white rounded-lg shadow-md border-t-4 border-[#CC0000] md:p-6">
        <h2 className="text-2xl font-bold text-[#CC0000] mb-4 text-center md:text-3xl">
          NC State {sport.charAt(0).toUpperCase() + sport.slice(1)} Live Scores
        </h2>

        {/* Live Games Section */}
        {liveGames.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
              Live Games
            </h3>
            {liveGames.map((game) => {
              const competition = game.competitions[0];
              const ncStateCompetitor = competition.competitors.find(
                (comp) => comp.team.id === espnAPI.NC_STATE_TEAM_ID
              );
              const opponentCompetitor = competition.competitors.find(
                (comp) => comp.team.id !== espnAPI.NC_STATE_TEAM_ID
              );

              if (!ncStateCompetitor || !opponentCompetitor) return null;

              const isNCStateHome = ncStateCompetitor.homeAway === 'home';
              const ncStateScore = ncStateCompetitor.score;
              const opponentScore = opponentCompetitor.score;
              const gameStatus = competition.status.type.shortDetail;
              const displayClock = competition.status.displayClock;
              const period = competition.status.period;

              return (
                <Link href={`/game/${game.id}`} key={game.id} passHref>
                  <div className="block p-4 mb-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {opponentCompetitor.team.displayName} vs NC State
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {gameStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-extrabold">
                      <span className="text-gray-700">
                        {isNCStateHome ? 'NC State' : opponentCompetitor.team.abbreviation}
                      </span>
                      <span className="text-gray-900">
                        {isNCStateHome ? ncStateScore : opponentScore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-extrabold">
                      <span className="text-gray-700">
                        {!isNCStateHome ? 'NC State' : opponentCompetitor.team.abbreviation}
                      </span>
                      <span className="text-gray-900">
                        {!isNCStateHome ? ncStateScore : opponentScore}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {period > 0 && `Q${period} - `} {displayClock}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Upcoming Games Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
            Upcoming Games
          </h3>
          {upcomingGames.length > 0 ? (
            upcomingGames.map((game) => {
              const competition = game.competitions[0];
              const ncStateCompetitor = competition.competitors.find(
                (comp) => comp.team.id === espnAPI.NC_STATE_TEAM_ID
              );
              const opponentCompetitor = competition.competitors.find(
                (comp) => comp.team.id !== espnAPI.NC_STATE_TEAM_ID
              );

              if (!ncStateCompetitor || !opponentCompetitor) return null;

              const isNCStateHome = ncStateCompetitor.homeAway === 'home';
              const opponentName = opponentCompetitor.team.displayName;
              const gameDate = formatGameDate(game.date);

              return (
                <Link href={`/game/${game.id}`} key={game.id} passHref>
                  <div className="block p-4 mb-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {isNCStateHome ? 'vs.' : '@'} {opponentName}
                    </p>
                    <p className="text-sm text-gray-600">{gameDate}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {competition.venue.fullName}, {competition.venue.address.city},{' '}
                      {competition.venue.address.state}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-gray-600">No upcoming games found for {sport}.</p>
          )}
        </div>

        {liveGames.length === 0 && upcomingGames.length === 0 && !loading && (
          <p className="text-gray-600 text-center">No live or upcoming games available for {sport}.</p>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default LiveGameWidget;

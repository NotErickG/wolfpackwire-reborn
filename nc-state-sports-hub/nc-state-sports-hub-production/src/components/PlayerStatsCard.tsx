'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PlayerStatsCardProps {
  player: {
    id: string;
    name: string;
    position: string;
    jerseyNumber: number;
    photo: string;
    stats: {
      points?: number;
      rebounds?: number;
      assists?: number;
      // Football stats
      passingYards?: number;
      rushingYards?: number;
      tackles?: number;
    };
    season: string;
    year: string; // Freshman, Sophomore, etc.
  };
  sport: 'basketball' | 'football';
  className?: string;
  onPlayerClick?: (playerId: string) => void;
}

export default function PlayerStatsCard({ 
  player, 
  sport, 
  className = '',
  onPlayerClick 
}: PlayerStatsCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (onPlayerClick) {
      onPlayerClick(player.id);
    }
  };

  const getStatsForSport = () => {
    if (sport === 'basketball') {
      return [
        { label: 'PPG', value: player.stats.points || 0 },
        { label: 'RPG', value: player.stats.rebounds || 0 },
        { label: 'APG', value: player.stats.assists || 0 }
      ];
    } else {
      return [
        { label: 'Pass Yds', value: player.stats.passingYards || 0 },
        { label: 'Rush Yds', value: player.stats.rushingYards || 0 },
        { label: 'Tackles', value: player.stats.tackles || 0 }
      ];
    }
  };

  const stats = getStatsForSport();

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 
        cursor-pointer transform hover:scale-105 border border-gray-200
        ${className}
      `}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {/* Player Photo */}
          <div className="flex-shrink-0 relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-red-600">
              {!imageError && player.photo ? (
                <Image
                  src={player.photo}
                  alt={`${player.name} photo`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <span className="text-gray-600 text-xl font-bold">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            {/* Jersey Number Badge */}
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {player.jerseyNumber}
            </div>
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {player.name}
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{player.position}</span>
              <span className="text-gray-400">•</span>
              <span>{player.year}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {player.season} Season
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl font-bold text-red-600">
                  {typeof stat.value === 'number' ? stat.value.toFixed(1) : stat.value}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sport Badge */}
        <div className="mt-3 flex justify-end">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {sport === 'basketball' ? '🏀' : '🏈'} {sport.charAt(0).toUpperCase() + sport.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
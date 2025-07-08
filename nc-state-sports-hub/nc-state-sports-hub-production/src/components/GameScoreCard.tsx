
import React from 'react';

interface GameScoreCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  gameStatus: string;
}

const GameScoreCard: React.FC<GameScoreCardProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  gameStatus,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 m-2 max-w-sm mx-auto">
      <div className="text-center text-sm text-gray-500 mb-2">
        {gameStatus}
      </div>
      <div className="flex justify-around items-center mb-4">
        <div className="text-center">
          <div className="font-bold text-lg">{homeTeam}</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-[#CC0000] mx-4">
            {homeScore} - {awayScore}
          </div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">{awayTeam}</div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400">
        {/* Additional game details can go here */}
      </div>
    </div>
  );
};

export default GameScoreCard;

import React from 'react';

interface TeamData {
  name: string;
  score: number;
  logo: string;
}

interface GameScoreCardProps {
  game: {
    id: string;
    date: string;
    homeTeam: TeamData;
    awayTeam: TeamData;
    status: string;
  };
}

const GameScoreCard: React.FC<GameScoreCardProps> = ({
  game: { homeTeam, awayTeam, status, homeScore, awayScore },
}) => {
  const isNCStateHome = homeTeam.name === 'NC State';
  const isNCStateAway = awayTeam.name === 'NC State';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 m-2 max-w-sm mx-auto">
      <div className="text-center text-sm text-gray-500 mb-2">
        {status}
      </div>
      <div className="flex justify-around items-center mb-4">
        <div className="text-center">
          <img src={homeTeam.logo} alt={`${homeTeam.name} logo`} className="h-12 w-12 mx-auto mb-2" />
          <div className="font-bold text-lg">{homeTeam.name}</div>
          <div className={`text-2xl font-bold ${isNCStateHome ? 'text-[#CC0000]' : 'text-gray-800'}`}>
            {homeTeam.score}
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-[#CC0000] mx-4">
            - 
          </div>
        </div>
        <div className="text-center">
          <img src={awayTeam.logo} alt={`${awayTeam.name} logo`} className="h-12 w-12 mx-auto mb-2" />
          <div className="font-bold text-lg">{awayTeam.name}</div>
          <div className={`text-2xl font-bold ${isNCStateAway ? 'text-[#CC0000]' : 'text-gray-800'}`}>
            {awayTeam.score}
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400">
        {/* Additional game details can go here */}
      </div>
    </div>
  );
};

export default GameScoreCard;
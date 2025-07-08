
import React, { useState, useMemo } from 'react';

// 1. TypeScript interface TeamRosterProps
interface TeamRosterProps {
  sport?: string;
  searchable?: boolean;
}

// 2. Player interface
interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  year: string;
  height: string;
  weight: number;
  hometown: string;
  photo: string; // Placeholder for player image
}

// Sample Data: 6-8 mock NC State football players
const MOCK_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Devin Leary',
    position: 'QB',
    number: 13,
    year: 'Senior',
    height: '6\'1"',
    weight: 215,
    hometown: 'Sicklerville, NJ',
    photo: 'https://via.placeholder.com/150/CC0000/FFFFFF?text=DL',
  },
  {
    id: '2',
    name: 'Zonovan Knight',
    position: 'RB',
    number: 24,
    year: 'Junior',
    height: '5\'11"',
    weight: 210,
    hometown: 'Harrisonburg, NC',
    photo: 'https://via.placeholder.com/150/CC0000/FFFFFF?text=ZK',
  },
  {
    id: '3',
    name: 'Thayer Thomas',
    position: 'WR',
    number: 5,
    year: 'Graduate',
    height: '6\'0"',
    weight: 195,
    hometown: 'Wake Forest, NC',
    photo: 'https://via.placeholder.com/150/CC0000/FFFFFF?text=TT',
  },
  {
    id: '4',
    name: 'Payton Wilson',
    position: 'LB',
    number: 11,
    year: 'Senior',
    height: '6\'4"',
    weight: 235,
    hometown: 'Hillsborough, NC',
    photo: 'https://via.placeholder.com/150/CC0000/FFFFFF?text=PW',
  },
  {
    id: '5',
    name: 'Cory Durden',
    position: 'DT',
    number: 10,
    year: 'Graduate',
    height: '6\'4"',
    weight: 310,
    hometown: 'Newberry, FL',
    photo: 'https://via.placeholder.com/150/CC0000/FFFFFF?text=CD',
  },
  {
    id: '6',
    name: 'Tyler Baker-Williams',
    position: 'CB',
    number: 1,
    year: 'Senior',
    height: '6\'0"',
    weight: 200,
    hometown: 'Jacksonville, FL',
    photo: 'https://via.placeholder.com/150/CC0000/FFFFFF?text=TBW',
  },
  {
    id: '7',
    name: 'Grant Gibson',
    position: 'C',
    number: 50,
    year: 'Graduate',
    height: '6\'1"',
    weight: 305,
    hometown: 'Charlotte, NC',
    photo: 'https://via.placeholder.com/150/CC0000/FFFFFF?text=GG',
  },
];

const TeamRoster: React.FC<TeamRosterProps> = ({ sport = 'Football', searchable = true }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Player>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(false); // Simulate loading

  // Simulate data fetching
  const players = useMemo(() => {
    // In a real app, this would be fetched from an API
    // For now, simulate a delay
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Simulate 0.5 second loading time
    return MOCK_PLAYERS;
  }, []);

  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = players.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.year.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [players, searchTerm, sortBy, sortOrder]);

  const handlePlayerClick = (player: Player) => {
    console.log('View detailed profile for:', player.name);
    // In a real application, this would navigate to a player detail page
    // e.g., router.push(`/players/${player.id}`);
  };

  const toggleSortOrder = (column: keyof Player) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-red-700">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-700"></div>
        <p className="ml-4 text-lg">Loading {sport} Roster...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-red-700 mb-6 text-center">
        NC State {sport} Roster
      </h1>

      {searchable && (
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search by name, position, or year..."
            className="w-full sm:w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search player roster"
          />
          <div className="flex gap-2 w-full sm:w-1/3 justify-end">
            <select
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              value={sortBy}
              onChange={(e) => toggleSortOrder(e.target.value as keyof Player)}
              aria-label="Sort players by"
            >
              <option value="name">Sort by Name</option>
              <option value="position">Sort by Position</option>
              <option value="number">Sort by Number</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-200"
              aria-label={`Sort order: ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      )}

      {filteredAndSortedPlayers.length === 0 ? (
        <div className="text-center text-gray-600 text-xl py-10">
          No players found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedPlayers.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer border-t-4 border-red-700"
              onClick={() => handlePlayerClick(player)}
              role="button"
              tabIndex={0}
              aria-label={`View profile for ${player.name}`}
            >
              <img
                src={player.photo}
                alt={`Photo of ${player.name}`}
                className="w-full h-48 object-cover object-center bg-gray-200"
              />
              <div className="p-4 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{player.name}</h2>
                <p className="text-red-700 font-bold text-lg mb-2">#{player.number} - {player.position}</p>
                <p className="text-gray-600 text-sm">
                  {player.year} | {player.height} | {player.weight} lbs
                </p>
                <p className="text-gray-500 text-sm mt-1">{player.hometown}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamRoster;

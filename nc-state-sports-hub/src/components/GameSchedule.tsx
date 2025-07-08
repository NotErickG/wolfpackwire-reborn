"use client";

import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from '../../amplify_outputs.json';
import { type Schema } from '../../amplify/data/resource';

Amplify.configure(config);

const client = generateClient<Schema>();

const GameSchedule = () => {
  const [games, setGames] = useState<Schema["Game"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, errors } = await client.models.Game.list({ authMode: 'iam' });
        if (errors) {
          throw new Error(errors.map(e => e.message).join('\n'));
        }
        setGames(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Upcoming Games</h2>
        <p>Loading game schedules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Upcoming Games</h2>
        <p className="text-red-500">Error loading games: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upcoming Games</h2>
      {games.length === 0 ? (
        <p>No upcoming games found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <div key={game.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-semibold">{game.homeTeam} vs {game.awayTeam}</h3>
              <p className="text-gray-600">Sport: {game.sport}</p>
              <p className="text-gray-600">Date: {new Date(game.gameDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Venue: {game.venue}</p>
              <p className="text-gray-600">Status: {game.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameSchedule;

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LiveScoreWidget from '../LiveScoreWidget';

// Mock ESPN API
jest.mock('@/lib/espn-api', () => ({
  espnAPI: {
    getLiveGames: jest.fn()
  }
}));

describe('LiveScoreWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<LiveScoreWidget />);
    expect(screen.getByText(/Component ready for implementation/)).toBeInTheDocument();
  });

  it('renders no games message when no live games', async () => {
    const { espnAPI } = require('@/lib/espn-api');
    espnAPI.getLiveGames.mockResolvedValue([]);

    render(<LiveScoreWidget />);
    
    await waitFor(() => {
      expect(screen.getByText(/No live basketball games at the moment/)).toBeInTheDocument();
    });
  });

  it('displays live game scores correctly', async () => {
    const mockGame = {
      id: '1',
      competitions: [{
        competitors: [
          {
            team: { id: '152', shortDisplayName: 'NC State' },
            score: '75'
          },
          {
            team: { id: '123', shortDisplayName: 'Duke', logo: 'duke-logo.png' },
            score: '68'
          }
        ],
        status: {
          type: { description: 'In Progress' },
          period: 2,
          displayClock: '5:23'
        },
        venue: { shortName: 'PNC Arena' }
      }]
    };

    const { espnAPI } = require('@/lib/espn-api');
    espnAPI.getLiveGames.mockResolvedValue([mockGame]);

    render(<LiveScoreWidget />);
    
    await waitFor(() => {
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('68')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('5:23')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const { espnAPI } = require('@/lib/espn-api');
    espnAPI.getLiveGames.mockRejectedValue(new Error('API Error'));

    render(<LiveScoreWidget />);
    
    await waitFor(() => {
      expect(screen.getByText(/No live basketball games at the moment/)).toBeInTheDocument();
    });
  });
});
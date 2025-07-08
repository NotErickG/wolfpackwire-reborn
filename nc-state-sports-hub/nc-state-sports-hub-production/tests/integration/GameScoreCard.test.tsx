import React from 'react';
import { render, screen } from '@testing-library/react';
import GameScoreCard from '@/components/GameScoreCard';

describe('GameScoreCard Integration Test', () => {
  const mockGameData = {
    id: '123',
    date: '2025-07-08T19:00:00Z',
    homeTeam: {
      name: 'NC State',
      score: 75,
      logo: '/path/to/ncstate-logo.png',
    },
    awayTeam: {
      name: 'Duke',
      score: 68,
      logo: '/path/to/duke-logo.png',
    },
    status: 'Final',
  };

  it('renders game score card with correct team names and scores', () => {
    render(<GameScoreCard game={mockGameData} />);

    expect(screen.getByText('NC State')).toBeInTheDocument();
    expect(screen.getByText('Duke')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('68')).toBeInTheDocument();
    expect(screen.getByText('Final')).toBeInTheDocument();
  });

  it('displays team logos', () => {
    render(<GameScoreCard game={mockGameData} />);

    const homeTeamLogo = screen.getByAltText('NC State logo');
    const awayTeamLogo = screen.getByAltText('Duke logo');

    expect(homeTeamLogo).toBeInTheDocument();
    expect(awayTeamLogo).toBeInTheDocument();
    expect(homeTeamLogo).toHaveAttribute('src', '/path/to/ncstate-logo.png');
    expect(awayTeamLogo).toHaveAttribute('src', '/path/to/duke-logo.png');
  });

  it('applies NC State branding to the home team score if NC State is home', () => {
    render(<GameScoreCard game={mockGameData} />);
    const ncStateScore = screen.getByText('75');
    // This is a simplified check. In a real scenario, you'd check computed styles or specific Tailwind classes.
    expect(ncStateScore).toHaveClass('text-[#CC0000]'); // Assuming the score element gets the branding color
  });

  it('applies NC State branding to the away team score if NC State is away', () => {
    const awayGameData = {
      ...mockGameData,
      homeTeam: {
        name: 'Duke',
        score: 68,
        logo: '/path/to/duke-logo.png',
      },
      awayTeam: {
        name: 'NC State',
        score: 75,
        logo: '/path/to/ncstate-logo.png',
      },
    };
    render(<GameScoreCard game={awayGameData} />);
    const ncStateScore = screen.getByText('75');
    expect(ncStateScore).toHaveClass('text-[#CC0000]');
  });
});

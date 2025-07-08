// ESPN API Integration for NC State Sports Hub
// Based on https://github.com/pseudo-r/Public-ESPN-API

export interface ESPNGame {
  id: string;
  date: string;
  name: string;
  shortName: string;
  season: {
    year: number;
    type: number;
  };
  competitions: Array<{
    id: string;
    venue: {
      id: string;
      fullName: string;
      address: {
        city: string;
        state: string;
      };
    };
    competitors: Array<{
      id: string;
      team: {
        id: string;
        displayName: string;
        shortDisplayName: string;
        abbreviation: string;
        logo: string;
        color: string;
        alternateColor: string;
      };
      score: string;
      homeAway: 'home' | 'away';
      winner: boolean;
    }>;
    status: {
      clock: number;
      displayClock: string;
      period: number;
      type: {
        id: string;
        name: string;
        state: string;
        completed: boolean;
        description: string;
        detail: string;
        shortDetail: string;
      };
    };
  }>;
}

export interface ESPNTeam {
  id: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  color: string;
  alternateColor: string;
  logo: string;
  record: {
    items: Array<{
      description: string;
      type: string;
      summary: string;
    }>;
  };
}

export interface ESPNAthlete {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  shortName: string;
  jersey: string;
  position: {
    id: string;
    name: string;
    displayName: string;
    abbreviation: string;
  };
  headshot: {
    href: string;
  };
  statistics: Array<{
    name: string;
    displayName: string;
    shortDisplayName: string;
    description: string;
    abbreviation: string;
    value: number;
    displayValue: string;
  }>;
}

class ESPNAPIService {
  private baseURL = 'https://site.api.espn.com/apis/site/v2/sports';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes for live data
  private readonly NC_STATE_TEAM_ID = '152'; // NC State's ESPN team ID

  /**
   * Get cached data or return null if expired
   */
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Set data in cache with timestamp
   */
  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Make API request with error handling and caching
   */
  private async makeRequest(url: string, cacheKey: string): Promise<any> {
    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'NC State Sports Hub/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`ESPN API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('ESPN API request failed:', error);
      throw new Error('Failed to fetch data from ESPN API');
    }
  }

  /**
   * Get NC State team information
   */
  async getNCStateTeam(sport: string = 'basketball'): Promise<ESPNTeam> {
    const sportPath = sport === 'basketball' ? 'basketball/mens-college-basketball' : 
                     sport === 'football' ? 'football/college-football' :
                     sport === 'baseball' ? 'baseball/college-baseball' : 
                     'basketball/mens-college-basketball';

    const url = `${this.baseURL}/${sportPath}/teams/${this.NC_STATE_TEAM_ID}`;
    const cacheKey = `ncstate-team-${sport}`;

    const data = await this.makeRequest(url, cacheKey);
    return data.team;
  }

  /**
   * Get NC State game schedule
   */
  async getNCStateSchedule(sport: string = 'basketball', season?: number): Promise<ESPNGame[]> {
    const currentYear = season || new Date().getFullYear();
    const sportPath = sport === 'basketball' ? 'basketball/mens-college-basketball' : 
                     sport === 'football' ? 'football/college-football' :
                     sport === 'baseball' ? 'baseball/college-baseball' : 
                     'basketball/mens-college-basketball';

    const url = `${this.baseURL}/${sportPath}/teams/${this.NC_STATE_TEAM_ID}/schedule`;
    const cacheKey = `ncstate-schedule-${sport}-${currentYear}`;

    const data = await this.makeRequest(url, cacheKey);
    return data.events || [];
  }

  /**
   * Get live/recent NC State games
   */
  async getNCStateLiveGames(sport: string = 'basketball'): Promise<ESPNGame[]> {
    const sportPath = sport === 'basketball' ? 'basketball/mens-college-basketball' : 
                     sport === 'football' ? 'football/college-football' :
                     sport === 'baseball' ? 'baseball/college-baseball' : 
                     'basketball/mens-college-basketball';

    const url = `${this.baseURL}/${sportPath}/scoreboard`;
    const cacheKey = `live-games-${sport}`;

    const data = await this.makeRequest(url, cacheKey);
    
    // Filter for NC State games
    const ncStateGames = data.events?.filter((game: ESPNGame) => 
      game.competitions[0].competitors.some(competitor => 
        competitor.team.id === this.NC_STATE_TEAM_ID
      )
    ) || [];

    return ncStateGames;
  }

  /**
   * Get NC State players/roster
   */
  async getNCStateRoster(sport: string = 'basketball'): Promise<ESPNAthlete[]> {
    const sportPath = sport === 'basketball' ? 'basketball/mens-college-basketball' : 
                     sport === 'football' ? 'football/college-football' :
                     sport === 'baseball' ? 'baseball/college-baseball' : 
                     'basketball/mens-college-basketball';

    const url = `${this.baseURL}/${sportPath}/teams/${this.NC_STATE_TEAM_ID}/roster`;
    const cacheKey = `ncstate-roster-${sport}`;

    const data = await this.makeRequest(url, cacheKey);
    return data.athletes || [];
  }

  /**
   * Get specific game details
   */
  async getGameDetails(gameId: string, sport: string = 'basketball'): Promise<ESPNGame> {
    const sportPath = sport === 'basketball' ? 'basketball/mens-college-basketball' : 
                     sport === 'football' ? 'football/college-football' :
                     sport === 'baseball' ? 'baseball/college-baseball' : 
                     'basketball/mens-college-basketball';

    const url = `${this.baseURL}/${sportPath}/summary?event=${gameId}`;
    const cacheKey = `game-details-${gameId}`;

    const data = await this.makeRequest(url, cacheKey);
    return data.header.game;
  }

  /**
   * Get ACC standings (NC State's conference)
   */
  async getACCStandings(sport: string = 'basketball'): Promise<any[]> {
    const sportPath = sport === 'basketball' ? 'basketball/mens-college-basketball' : 
                     sport === 'football' ? 'football/college-football' :
                     sport === 'baseball' ? 'baseball/college-baseball' : 
                     'basketball/mens-college-basketball';

    const url = `${this.baseURL}/${sportPath}/standings?group=1`; // ACC group
    const cacheKey = `acc-standings-${sport}`;

    const data = await this.makeRequest(url, cacheKey);
    return data.standings || [];
  }

  /**
   * Get upcoming NC State games (next 7 days)
   */
  async getUpcomingGames(sport: string = 'basketball'): Promise<ESPNGame[]> {
    const schedule = await this.getNCStateSchedule(sport);
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return schedule.filter(game => {
      const gameDate = new Date(game.date);
      return gameDate >= now && gameDate <= oneWeekFromNow;
    });
  }

  /**
   * Get recent NC State games (last 7 days)
   */
  async getRecentGames(sport: string = 'basketball'): Promise<ESPNGame[]> {
    const schedule = await this.getNCStateSchedule(sport);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return schedule.filter(game => {
      const gameDate = new Date(game.date);
      return gameDate <= now && gameDate >= oneWeekAgo;
    });
  }

  /**
   * Check if NC State is currently playing
   */
  async isNCStatePlaying(sport: string = 'basketball'): Promise<boolean> {
    const liveGames = await this.getNCStateLiveGames(sport);
    return liveGames.some(game => 
      game.competitions[0].status.type.state === 'in'
    );
  }

  /**
   * Get all NC State sports data (football, basketball, baseball)
   */
  async getAllNCStateSports(): Promise<{
    football: { games: ESPNGame[]; team: ESPNTeam; roster: ESPNAthlete[] };
    basketball: { games: ESPNGame[]; team: ESPNTeam; roster: ESPNAthlete[] };
    baseball: { games: ESPNGame[]; team: ESPNTeam; roster: ESPNAthlete[] };
  }> {
    try {
      const [
        footballGames, footballTeam, footballRoster,
        basketballGames, basketballTeam, basketballRoster,
        baseballGames, baseballTeam, baseballRoster
      ] = await Promise.all([
        this.getNCStateSchedule('football'),
        this.getNCStateTeam('football'),
        this.getNCStateRoster('football'),
        this.getNCStateSchedule('basketball'),
        this.getNCStateTeam('basketball'),
        this.getNCStateRoster('basketball'),
        this.getNCStateSchedule('baseball'),
        this.getNCStateTeam('baseball'),
        this.getNCStateRoster('baseball'),
      ]);

      return {
        football: { games: footballGames, team: footballTeam, roster: footballRoster },
        basketball: { games: basketballGames, team: basketballTeam, roster: basketballRoster },
        baseball: { games: baseballGames, team: baseballTeam, roster: baseballRoster },
      };
    } catch (error) {
      console.error('Failed to fetch all NC State sports data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const espnAPI = new ESPNAPIService();
export default espnAPI;
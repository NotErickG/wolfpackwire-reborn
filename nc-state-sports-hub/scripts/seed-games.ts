import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from '../amplify_outputs.json';
import { type Schema } from '../amplify/data/resource';

Amplify.configure(config);

const client = generateClient<Schema>();

async function seedGames() {
  try {
    console.log('Seeding games...');

    const espnApiUrl = 'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard';
    const response = await fetch(espnApiUrl);
    const data = await response.json();

    if (data.events && data.events.length > 0) {
      for (const event of data.events) {
        const homeTeam = event.competitions[0].competitors.find((c: any) => c.homeAway === 'home').team.displayName;
        const awayTeam = event.competitions[0].competitors.find((c: any) => c.homeAway === 'away').team.displayName;
        const gameDate = new Date(event.date).toISOString();
        const venue = event.competitions[0].venue.fullName;
        const status = event.status.type.detail;
        const season = event.season.year.toString();

        const game = {
          homeTeam,
          awayTeam,
          sport: 'Basketball', // Assuming all games from this endpoint are basketball
          gameDate,
          venue,
          status,
          season,
          isHomeGame: event.competitions[0].competitors.find((c: any) => c.homeAway === 'home').team.displayName === 'NC State', // Adjust based on actual NC State team name
          homeScore: event.competitions[0].competitors.find((c: any) => c.homeAway === 'home').score || 0,
          awayScore: event.competitions[0].competitors.find((c: any) => c.homeAway === 'away').score || 0,
        };

        await client.models.Game.create(game, { authMode: 'iam' });
        console.log(`Created game: ${game.homeTeam} vs ${game.awayTeam}`);
      }
    } else {
      console.log('No events found from ESPN API.');
    }

    console.log('Games seeded successfully!');
  } catch (error) {
    console.error('Error seeding games:', error);
  }
}

seedGames();

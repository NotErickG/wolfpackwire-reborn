# GraphQL API Specifications

## Overview
The NC State Sports Hub uses GraphQL for all API interactions, providing real-time data for sports information, user management, and content delivery.

## Core Data Models

### Teams
```graphql
type Team {
  id: ID!
  name: String!
  sport: String!
  season: String!
  record: String
  ranking: Int
  nextGame: String
  logoUrl: String
  isActive: Boolean!
  players: [Player!]!
}
```

### Players
```graphql
type Player {
  id: ID!
  firstName: String!
  lastName: String!
  position: String!
  team: Team!
  jerseyNumber: Int
  year: String
  height: String
  weight: String
  hometown: String
  photoUrl: String
  stats: AWSJSON
  isActive: Boolean!
}
```

### Games
```graphql
type Game {
  id: ID!
  homeTeam: String!
  awayTeam: String!
  sport: String!
  gameDate: AWSDateTime!
  venue: String
  homeScore: Int
  awayScore: Int
  status: String!
  season: String!
  isHomeGame: Boolean!
  ticketUrl: String
  tvChannel: String
  liveStreamUrl: String
}
```

### Articles
```graphql
type Article {
  id: ID!
  title: String!
  slug: String!
  excerpt: String!
  content: String!
  author: User!
  category: String!
  tags: [String!]
  featuredImage: String
  publishedAt: AWSDateTime
  isPublished: Boolean!
  viewCount: Int!
  likes: [ArticleLike!]!
  comments: [Comment!]!
}
```

## Query Operations

### Get Live Scores
```graphql
query GetLiveScores {
  listGames(filter: { status: { eq: "LIVE" } }) {
    items {
      id
      homeTeam
      awayTeam
      homeScore
      awayScore
      status
      gameDate
    }
  }
}
```

### Get Team Roster
```graphql
query GetTeamRoster($teamId: ID!) {
  getTeam(id: $teamId) {
    id
    name
    sport
    players {
      items {
        id
        firstName
        lastName
        position
        jerseyNumber
        year
      }
    }
  }
}
```

### Get Latest News
```graphql
query GetLatestNews($limit: Int = 10) {
  listArticles(
    filter: { isPublished: { eq: true } }
    sortDirection: DESC
    limit: $limit
  ) {
    items {
      id
      title
      slug
      excerpt
      featuredImage
      publishedAt
      author {
        username
        firstName
        lastName
      }
    }
  }
}
```

## Mutation Operations

### Create Comment
```graphql
mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    content
    createdAt
    user {
      username
    }
  }
}
```

### Like Article
```graphql
mutation LikeArticle($articleId: ID!) {
  createArticleLike(input: { articleId: $articleId }) {
    id
    createdAt
  }
}
```

## Subscription Operations

### Live Game Updates
```graphql
subscription OnGameUpdate($gameId: ID!) {
  onUpdateGame(id: $gameId) {
    id
    homeScore
    awayScore
    status
    gameDate
  }
}
```

### New Comments
```graphql
subscription OnCommentAdded($articleId: ID!) {
  onCreateComment(articleId: $articleId) {
    id
    content
    createdAt
    user {
      username
    }
  }
}
```

## Authorization Rules

### Public Access
- Read access to teams, players, games, and published articles
- No authentication required for basic sports data

### Authenticated Users
- Create comments and likes
- Access to user profile management
- Personalized content recommendations

### Admin Users
- Full CRUD access to all data models
- Content moderation capabilities
- User management functions

## Rate Limiting
- Public API: 100 requests per minute
- Authenticated API: 1000 requests per minute
- Admin API: 10000 requests per minute

## Caching Strategy
- Team and player data: 1 hour TTL
- Game scores: 30 seconds TTL during live games
- Article content: 24 hours TTL
- User data: 5 minutes TTL
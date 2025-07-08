import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // NC State Teams
  Team: a
    .model({
      name: a.string().required(),
      sport: a.string().required(),
      season: a.string().required(),
      record: a.string(),
      ranking: a.integer(),
      logoUrl: a.string(),
      isActive: a.boolean().default(true),
      nextGameDate: a.datetime(),
      nextOpponent: a.string(),
      homeVenue: a.string(),
      coachName: a.string(),
      rosterCount: a.integer(),
      players: a.hasMany('Player', 'teamId'),
      games: a.hasMany('Game', 'teamId'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Players
  Player: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      fullName: a.string(),
      position: a.string().required(),
      jerseyNumber: a.integer(),
      year: a.string(), // Freshman, Sophomore, Junior, Senior, Graduate
      height: a.string(),
      weight: a.string(),
      hometown: a.string(),
      highSchool: a.string(),
      photoUrl: a.string(),
      stats: a.json(), // Flexible stats storage
      statistics: a.hasMany('Statistic', 'playerId'),
      isActive: a.boolean().default(true),
      teamId: a.id().required(),
      team: a.belongsTo('Team', 'teamId'),
      major: a.string(),
      biography: a.string(),
      socialMedia: a.json(), // Twitter, Instagram handles
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Games and Matches
  Game: a
    .model({
      homeTeam: a.string().required(),
      awayTeam: a.string().required(),
      sport: a.string().required(),
      gameDate: a.datetime().required(),
      venue: a.string(),
      homeScore: a.integer(),
      awayScore: a.integer(),
      status: a.string().required(), // upcoming, live, completed, postponed, cancelled
      season: a.string().required(),
      isHomeGame: a.boolean().default(false),
      ticketUrl: a.string(),
      tvChannel: a.string(),
      liveStreamUrl: a.string(),
      gameRecap: a.string(),
      highlights: a.string().array(),
      attendanceCount: a.integer(),
      weather: a.string(),
      spread: a.float(),
      overUnder: a.float(),
      teamId: a.id(),
      team: a.belongsTo('Team', 'teamId'),
      statistics: a.hasMany('Statistic', 'gameId'),
      events: a.hasMany('Event', 'relatedGameId'),
      lastUpdated: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Sports News Articles
  Article: a
    .model({
      title: a.string().required(),
      slug: a.string().required(),
      excerpt: a.string().required(),
      content: a.string().required(),
      category: a.string().required(), // news, analysis, recruiting, gameday
      tags: a.string().array(),
      featuredImage: a.string(),
      imageAlt: a.string(),
      publishedAt: a.datetime(),
      isPublished: a.boolean().default(false),
      isFeatured: a.boolean().default(false),
      viewCount: a.integer().default(0),
      readingTime: a.integer(), // estimated reading time in minutes
      authorId: a.id().required(),
      author: a.belongsTo('User', 'authorId'),
      likes: a.hasMany('ArticleLike', 'articleId'),
      comments: a.hasMany('Comment', 'articleId'),
      relatedArticles: a.string().array(), // Array of article IDs
      seoTitle: a.string(),
      seoDescription: a.string(),
      socialImage: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('editors').to(['create', 'read', 'update', 'delete']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // User Profiles and Fan Accounts
  User: a
    .model({
      email: a.string().required(),
      username: a.string().required(),
      firstName: a.string(),
      lastName: a.string(),
      displayName: a.string(),
      profilePicture: a.string(),
      favoriteTeam: a.string(),
      favoriteSport: a.string(),
      graduationYear: a.integer(),
      major: a.string(),
      bio: a.string(),
      location: a.string(),
      isVerified: a.boolean().default(false),
      isAlumni: a.boolean().default(false),
      isStudent: a.boolean().default(false),
      subscriptionType: a.string().default('free'), // free, premium
      notificationPreferences: a.json(),
      socialLinks: a.json(),
      joinedDate: a.datetime(),
      lastLoginDate: a.datetime(),
      articles: a.hasMany('Article', 'authorId'),
      comments: a.hasMany('Comment', 'userId'),
      likes: a.hasMany('ArticleLike', 'userId'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Comments and Discussions
  Comment: a
    .model({
      content: a.string().required(),
      articleId: a.id().required(),
      article: a.belongsTo('Article', 'articleId'),
      userId: a.id().required(),
      user: a.belongsTo('User', 'userId'),
      parentId: a.id(),
      parent: a.belongsTo('Comment', 'parentId'),
      replies: a.hasMany('Comment', 'parentId'),
      likes: a.integer().default(0),
      isApproved: a.boolean().default(false),
      isEdited: a.boolean().default(false),
      editedAt: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('moderators').to(['read', 'update']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Article Likes and Engagement
  ArticleLike: a
    .model({
      articleId: a.id().required(),
      article: a.belongsTo('Article', 'articleId'),
      userId: a.id().required(),
      user: a.belongsTo('User', 'userId'),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Sports Statistics
  Statistic: a
    .model({
      playerId: a.id().required(),
      player: a.belongsTo('Player', 'playerId'),
      gameId: a.id(),
      game: a.belongsTo('Game', 'gameId'),
      season: a.string().required(),
      statType: a.string().required(),
      value: a.float().required(),
      label: a.string(), // Human readable label
      category: a.string(), // offense, defense, special teams
      date: a.datetime(),
      isSeasonTotal: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Recruiting Information
  Recruit: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      position: a.string().required(),
      height: a.string(),
      weight: a.string(),
      hometown: a.string(),
      highSchool: a.string(),
      graduationYear: a.integer().required(),
      rating: a.integer(), // Star rating (1-5)
      ranking: a.integer(), // National ranking
      offers: a.string().array(), // Array of school names
      commitment: a.string(), // Committed school
      commitmentDate: a.datetime(),
      sport: a.string().required(),
      photoUrl: a.string(),
      hudlUrl: a.string(),
      socialMedia: a.json(),
      notes: a.string(),
      isCommitted: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Events and Calendar
  Event: a
    .model({
      title: a.string().required(),
      description: a.string(),
      eventType: a.string().required(), // game, press_conference, practice, tailgate
      startDate: a.datetime().required(),
      endDate: a.datetime(),
      location: a.string(),
      isPublic: a.boolean().default(true),
      ticketRequired: a.boolean().default(false),
      ticketUrl: a.string(),
      contact: a.string(),
      tags: a.string().array(),
      relatedGameId: a.id(),
      relatedGame: a.belongsTo('Game', 'relatedGameId'),
      imageUrl: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // API key for public data access
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
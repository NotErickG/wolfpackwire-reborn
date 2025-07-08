import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Sports Teams
  Team: a
    .model({
      name: a.string().required(),
      sport: a.string().required(),
      season: a.string().required(),
      players: a.hasMany('Player', 'teamId'),
      record: a.string(),
      ranking: a.integer(),
      nextGame: a.string(),
      logoUrl: a.string(),
      isActive: a.boolean().default(true),
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
      position: a.string().required(),
      teamId: a.id().required(),
      team: a.belongsTo('Team', 'teamId'),
      jerseyNumber: a.integer(),
      year: a.string(),
      height: a.string(),
      weight: a.string(),
      hometown: a.string(),
      photoUrl: a.string(),
      stats: a.hasMany('Statistic', 'playerId'),
      isActive: a.boolean().default(true),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Games/Matches
  Game: a
    .model({
      homeTeam: a.string().required(),
      awayTeam: a.string().required(),
      sport: a.string().required(),
      gameDate: a.datetime().required(),
      venue: a.string(),
      homeScore: a.integer(),
      awayScore: a.integer(),
      status: a.string().required(),
      season: a.string().required(),
      isHomeGame: a.boolean().default(false),
      ticketUrl: a.string(),
      tvChannel: a.string(),
      liveStreamUrl: a.string(),
      statistics: a.hasMany('Statistic', 'gameId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // News Articles
  Article: a
    .model({
      title: a.string().required(),
      slug: a.string().required(),
      excerpt: a.string().required(),
      content: a.string().required(),
      authorId: a.id().required(),
      author: a.belongsTo('User', 'authorId'),
      category: a.string().required(),
      tags: a.string().array(),
      featuredImage: a.string(),
      publishedAt: a.datetime(),
      isPublished: a.boolean().default(false),
      viewCount: a.integer().default(0),
      likes: a.hasMany('ArticleLike', 'articleId'),
      comments: a.hasMany('Comment', 'articleId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // User profiles
  User: a
    .model({
      email: a.string().required(),
      username: a.string().required(),
      firstName: a.string(),
      lastName: a.string(),
      profilePicture: a.string(),
      favoriteTeam: a.string(),
      favoriteSport: a.string(),
      graduationYear: a.integer(),
      bio: a.string(),
      isVerified: a.boolean().default(false),
      joinedDate: a.datetime(),
      articles: a.hasMany('Article', 'authorId'),
      comments: a.hasMany('Comment', 'userId'),
      likes: a.hasMany('ArticleLike', 'userId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Comments
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
      createdAt: a.datetime(),
      isApproved: a.boolean().default(false),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('moderators').to(['read', 'update']),
      allow.group('admins').to(['create', 'read', 'update', 'delete']),
    ]),

  // Article Likes
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
      date: a.datetime(),
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
  },
});
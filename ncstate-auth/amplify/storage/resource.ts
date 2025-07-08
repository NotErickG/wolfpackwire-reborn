import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'ncstateSportsMedia',
  access: (allow) => ({
    'public/team-logos/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admins']).to(['read', 'write', 'delete']),
    ],
    'public/player-photos/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admins']).to(['read', 'write', 'delete']),
    ],
    'public/article-images/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admins']).to(['read', 'write', 'delete']),
    ],
    'protected/user-uploads/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.groups(['admins']).to(['read', 'write', 'delete']),
    ],
    'private/admin-content/*': [
      allow.groups(['admins']).to(['read', 'write', 'delete']),
    ],
  }),
});
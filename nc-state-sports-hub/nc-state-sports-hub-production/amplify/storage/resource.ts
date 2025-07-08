import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'ncstatesportsmedia',
  access: (allow) => ({
    // Public assets - team logos, player photos, etc.
    'public/team-logos/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admins', 'editors']).to(['read', 'write', 'delete']),
    ],
    'public/player-photos/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admins', 'editors']).to(['read', 'write', 'delete']),
    ],
    'public/article-images/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admins', 'editors']).to(['read', 'write', 'delete']),
    ],
    'public/game-photos/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admins', 'editors']).to(['read', 'write', 'delete']),
    ],
    'public/venue-photos/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admins', 'editors']).to(['read', 'write', 'delete']),
    ],
    'public/branding/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admins']).to(['read', 'write', 'delete']),
    ],
    
    // Protected user uploads - profile pictures, user content
    'protected/user-uploads/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.groups(['moderators', 'admins']).to(['read', 'write', 'delete']),
    ],
    'protected/user-profiles/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']), // Other users can view profile pics
      allow.groups(['moderators', 'admins']).to(['read', 'write', 'delete']),
    ],
    
    // Private admin content - sensitive documents, reports
    'private/admin-content/*': [
      allow.groups(['admins']).to(['read', 'write', 'delete']),
    ],
    'private/reports/*': [
      allow.groups(['admins']).to(['read', 'write', 'delete']),
    ],
    'private/backups/*': [
      allow.groups(['admins']).to(['read', 'write', 'delete']),
    ],
    
    // Temporary uploads - for processing before moving to permanent location
    'temp/uploads/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.groups(['admins', 'editors']).to(['read', 'write', 'delete']),
    ],
  }),
});
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Welcome to NC State Sports Hub!',
      verificationEmailBody: (createCode) =>
        `Welcome to NC State Sports Hub! Your verification code is ${createCode()}. Go Pack!`,
    },
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
    givenName: {
      required: true,
      mutable: true,
    },
    familyName: {
      required: true,
      mutable: true,
    },
    preferredUsername: {
      required: false,
      mutable: true,
    },
    'custom:favoriteTeam': {
      dataType: 'String',
      mutable: true,
    },
    'custom:favoriteSport': {
      dataType: 'String',
      mutable: true,
    },
    'custom:graduationYear': {
      dataType: 'Number',
      mutable: true,
    },
  },
  groups: ['fans', 'premium_fans', 'moderators', 'admins'],
});
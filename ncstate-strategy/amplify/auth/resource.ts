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
    given_name: {
      required: true,
      mutable: true,
    },
    family_name: {
      required: true,
      mutable: true,
    },
    preferred_username: {
      required: false,
      mutable: true,
    },
    'custom:favorite_team': {
      dataType: 'String',
      mutable: true,
    },
    'custom:favorite_sport': {
      dataType: 'String',
      mutable: true,
    },
    'custom:graduation_year': {
      dataType: 'Number',
      mutable: true,
    },
  },
  groups: ['fans', 'premium_fans', 'moderators', 'admins'],
});
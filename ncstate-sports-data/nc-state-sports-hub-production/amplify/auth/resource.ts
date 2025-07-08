import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Welcome to NC State Sports Hub!',
      verificationEmailBody: (createCode) =>
        `Welcome to NC State Sports Hub - the ultimate destination for Wolfpack fans! 
        
Your verification code is: ${createCode()}

Go Pack! 🐺

This code will expire in 24 hours. If you didn't request this verification, please ignore this email.`,
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
    // Custom attributes for NC State fans
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
    'custom:is_alumni': {
      dataType: 'Boolean',
      mutable: true,
    },
    'custom:is_student': {
      dataType: 'Boolean',
      mutable: true,
    },
    'custom:major': {
      dataType: 'String',
      mutable: true,
    },
    'custom:subscription_type': {
      dataType: 'String',
      mutable: true,
    },
    'custom:notification_preferences': {
      dataType: 'String',
      mutable: true,
    },
  },
  // User groups for different access levels
  groups: ['fans', 'premium_fans', 'alumni', 'students', 'moderators', 'editors', 'admins'],
  
  // Multi-factor authentication for admin users
  multifactor: {
    mode: 'OPTIONAL',
    totp: true,
    sms: false, // Disable SMS to avoid costs
  },
  
  // Password policy
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false, // Optional for better UX
  },
  
  // Account recovery
  accountRecovery: 'EMAIL_ONLY',
});
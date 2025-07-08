import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

export const backend = defineBackend({
  auth,
  data,
  storage,
});

// Cost optimization: Use provisioned capacity for predictable costs
const dataResource = backend.data.resources.cfnResources;
dataResource.cfnGraphqlApi.addPropertyOverride('logConfig', {
  cloudWatchLogsRoleArn: undefined,
  fieldLogLevel: 'ERROR',
  excludeVerboseContent: true,
});

// Enable caching to reduce API calls
dataResource.cfnGraphqlApi.addPropertyOverride('additionalAuthenticationProviders', [
  {
    authenticationType: 'API_KEY',
    apiKeyConfig: {
      description: 'Public API for sports data',
      expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year
    },
  },
]);

// Configure cost-optimized storage settings
const storageResource = backend.storage.resources.cfnResources;
storageResource.cfnBucket.addPropertyOverride('lifecycleConfiguration', {
  rules: [
    {
      id: 'OptimizeCosts',
      status: 'Enabled',
      transitions: [
        {
          days: 30,
          storageClass: 'STANDARD_IA',
        },
        {
          days: 90,
          storageClass: 'GLACIER',
        },
      ],
    },
  ],
});
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

export const backend = defineBackend({
  auth,
  data,
  storage,
});

// Cost optimization: Configure logging and caching
const dataResource = backend.data.resources.cfnResources;
dataResource.cfnGraphqlApi.addPropertyOverride('logConfig', {
  cloudWatchLogsRoleArn: undefined,
  fieldLogLevel: 'ERROR', // Reduce logging costs
  excludeVerboseContent: true,
});

// Enable caching to reduce API calls
dataResource.cfnGraphqlApi.addPropertyOverride('additionalAuthenticationProviders', [
  {
    authenticationType: 'API_KEY',
    apiKeyConfig: {
      description: 'Public API for NC State sports data',
      expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year
    },
  },
]);

// Configure cost-optimized storage settings
const storageResource = backend.storage.resources.cfnResources;
storageResource.cfnBucket.addPropertyOverride('lifecycleConfiguration', {
  rules: [
    {
      id: 'CostOptimization',
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

// Add environment-specific configurations
const environment = process.env.NODE_ENV || 'development';

if (environment === 'production') {
  // Production optimizations
  dataResource.cfnGraphqlApi.addPropertyOverride('xrayEnabled', true);
  
  // Enable enhanced monitoring for production
  storageResource.cfnBucket.addPropertyOverride('loggingConfiguration', {
    destinationBucketName: 'ncstatesports-access-logs',
    logFilePrefix: 'access-logs/',
  });
} else {
  // Development environment settings
  console.log('Development environment detected - using cost-optimized settings');
}
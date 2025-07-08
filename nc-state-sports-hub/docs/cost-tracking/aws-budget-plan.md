# AWS Cost Tracking and Budget Plan

## Budget Overview
**Monthly Budget Target**: $5.00 maximum
**Alert Thresholds**: $3.00 (60%), $4.50 (90%)

## Cost Breakdown by Service

### DynamoDB (Estimated: $1.50-2.00/month)
- **On-Demand Pricing**: $0.25 per million read requests, $1.25 per million write requests
- **Storage**: $0.25 per GB per month
- **Expected Usage**: 10M reads, 1M writes, 2GB storage
- **Optimization**: Implement caching, optimize queries, use GSI efficiently

### S3 Storage (Estimated: $0.50-1.00/month)
- **Standard Storage**: $0.023 per GB per month
- **Requests**: $0.0004 per 1000 GET requests
- **Expected Usage**: 20GB storage, 100K requests
- **Optimization**: Lifecycle policies, image compression, CloudFront integration

### Lambda Functions (Estimated: $0.20-0.50/month)
- **Compute**: $0.0000166667 per GB-second
- **Requests**: $0.20 per 1M requests
- **Expected Usage**: 1M invocations, 1GB memory, 500ms average duration
- **Optimization**: Optimize function duration, use appropriate memory allocation

### Cognito (Estimated: $0.50-1.00/month)
- **User Pool**: $0.0055 per MAU (Monthly Active User)
- **Expected Usage**: 200-500 MAUs
- **Optimization**: Monitor user activity, implement efficient token refresh

### API Gateway (Estimated: $0.30-0.70/month)
- **API Calls**: $3.50 per million API calls
- **Expected Usage**: 100K-200K API calls
- **Optimization**: Implement caching, reduce redundant calls

### CloudWatch (Estimated: $0.20-0.50/month)
- **Logs**: $0.50 per GB ingested
- **Metrics**: $0.30 per metric per month
- **Expected Usage**: 1GB logs, 50 custom metrics
- **Optimization**: Log level management, metric consolidation

## Cost Optimization Strategies

### DynamoDB Optimization
```typescript
// Use composite keys for efficient queries
const gsi1pk = `TEAM#${teamId}`;
const gsi1sk = `PLAYER#${playerId}`;

// Implement caching for frequently accessed data
const cache = new Map();
const getCachedTeam = (teamId: string) => {
  const cached = cache.get(teamId);
  if (cached && Date.now() - cached.timestamp < 3600000) {
    return cached.data;
  }
  // Fetch from DynamoDB
};
```

### S3 Lifecycle Policies
```json
{
  "Rules": [
    {
      "ID": "ImageOptimization",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

### Lambda Optimization
```typescript
// Optimize memory and timeout settings
export const handler = async (event: APIGatewayEvent) => {
  // Use connection pooling
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    maxAttempts: 3,
  });
  
  // Implement early returns
  if (!event.body) {
    return { statusCode: 400, body: 'Missing request body' };
  }
  
  // Optimize database queries
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: { ':pk': event.pathParameters.id },
    Limit: 10, // Limit results to reduce costs
  };
};
```

## Monitoring and Alerting

### CloudWatch Alarms
```yaml
EstimatedChargesAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: "NC-State-Sports-Hub-Budget-Alert"
    AlarmDescription: "Alert when estimated charges exceed $3"
    MetricName: "EstimatedCharges"
    Namespace: "AWS/Billing"
    Statistic: "Maximum"
    Period: 86400
    EvaluationPeriods: 1
    Threshold: 3
    ComparisonOperator: "GreaterThanThreshold"
```

### Cost Anomaly Detection
```typescript
// Set up cost anomaly detection
const costAnomalyDetector = {
  DetectorName: 'NC-State-Sports-Hub-Anomaly-Detector',
  MonitorType: 'DIMENSIONAL',
  MonitorSpecification: {
    DimensionKey: 'SERVICE',
    Values: ['Amazon DynamoDB', 'Amazon S3', 'AWS Lambda', 'Amazon Cognito'],
    MatchOptions: ['EQUALS']
  }
};
```

## Weekly Cost Review Checklist

### DynamoDB
- [ ] Review read/write capacity utilization
- [ ] Check for hot partitions and inefficient queries
- [ ] Monitor table and index sizes
- [ ] Verify caching effectiveness

### S3
- [ ] Review storage class distribution
- [ ] Check data transfer costs
- [ ] Monitor request patterns
- [ ] Verify lifecycle policy effectiveness

### Lambda
- [ ] Review function duration and memory usage
- [ ] Check for cold start impacts
- [ ] Monitor error rates and retries
- [ ] Optimize frequently called functions

### Cognito
- [ ] Monitor Monthly Active Users
- [ ] Check authentication patterns
- [ ] Review token refresh frequency
- [ ] Verify user pool configuration

## Cost Emergency Procedures

### If Monthly Costs Exceed $4.50
1. **Immediate Actions**:
   - Disable non-essential Lambda functions
   - Reduce DynamoDB provisioned capacity
   - Implement aggressive caching
   - Pause non-critical data sync operations

2. **Investigation**:
   - Review cost explorer for anomalies
   - Check for unexpected traffic spikes
   - Verify resource configurations
   - Analyze usage patterns

3. **Resolution**:
   - Implement additional optimizations
   - Consider architectural changes
   - Update monitoring thresholds
   - Document lessons learned

### Cost Forecasting
- **Daily**: Monitor current month projection
- **Weekly**: Review previous week's costs and trends
- **Monthly**: Analyze monthly costs and plan optimizations
- **Quarterly**: Review overall cost trends and budget adjustments

## Reporting Dashboard
Create a weekly cost report including:
- Current month spending vs. budget
- Service breakdown and trends
- Cost per user metrics
- Optimization recommendations
- Budget forecast for next month
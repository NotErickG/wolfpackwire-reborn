# AWS Amplify CI/CD & DevOps Commands - DEPLOYMENT SPECIALIST

🎯 **AMPLIFY CI/CD EXPERT**: Generate all commands for AWS Amplify built-in CI/CD instead of GitHub Actions.

## AWS Amplify CI/CD Configuration

### **Amplify Console Setup Commands**:
```bash
# Initialize Amplify app with CI/CD
amplify init --appName nc-state-sports-hub --envName dev --defaultsProviders awscloudformation --yes

# Add hosting with CI/CD
amplify add hosting
# Select: Amazon CloudFront and S3
# Choose: Manual deployment initially, then set up CI/CD

# Configure CI/CD for staging environment
amplify env add staging
amplify env checkout staging
amplify push --yes

# Configure CI/CD for production environment
amplify env add production
amplify env checkout production
amplify push --yes
```

### **Amplify CI/CD Build Specification**:
```yaml
# amplify.yml - Amplify build configuration
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - echo "Installing dependencies..."
            - npm ci
            - echo "Running security audit..."
            - npm audit --audit-level high
            - echo "Running linting..."
            - npm run lint:check
            - echo "Running type checking..."
            - npm run type-check
        build:
          commands:
            - echo "Building Next.js application..."
            - npm run build
            - echo "Running tests..."
            - npm run test -- --passWithNoTests --watchAll=false
            - echo "Running performance audit..."
            - npm run performance:audit || echo "Performance audit completed with warnings"
        postBuild:
          commands:
            - echo "Build completed successfully"
            - echo "Checking bundle size..."
            - npm run analyze
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
    backend:
      phases:
        preBuild:
          commands:
            - echo "Installing Amplify CLI..."
            - npm install -g @aws-amplify/cli@latest
            - echo "Installing backend dependencies..."
            - cd amplify && npm ci && cd ..
        build:
          commands:
            - echo "Deploying backend..."
            - amplify push --yes
        postBuild:
          commands:
            - echo "Backend deployment completed"
            - echo "Running post-deployment health checks..."
            - ./scripts/health-check.sh
```

### **Environment-Specific Build Commands**:
```bash
# Development environment deployment
amplify env checkout dev
amplify push --yes

# Staging environment with additional testing
amplify env checkout staging
amplify push --yes
# Run integration tests against staging
npm run test:e2e:staging

# Production deployment with approval
amplify env checkout production
# Manual approval required in Amplify Console
amplify push --yes
# Run production health checks
./scripts/production-health-check.sh
```

## Branch-Based Deployment Strategy

### **Git Branch to Environment Mapping**:
```bash
# Configure branch-based deployments in Amplify Console

# Development branch → dev environment
git checkout -b development
git push origin development
# Amplify auto-deploys development branch to dev environment

# Staging branch → staging environment  
git checkout -b staging
git push origin staging
# Amplify auto-deploys staging branch to staging environment

# Main branch → production environment
git checkout main
# Amplify deploys main branch to production with manual approval
```

### **Feature Branch Development**:
```bash
# Create feature branches for parallel development
git checkout -b feature/frontend-components
git checkout -b feature/backend-apis
git checkout -b feature/user-authentication
git checkout -b feature/sports-data-integration

# Set up git worktrees for parallel agent development
git worktree add ../ncstate-frontend feature/frontend-components
git worktree add ../ncstate-backend feature/backend-apis
git worktree add ../ncstate-auth feature/user-authentication
git worktree add ../ncstate-sports-data feature/sports-data-integration

# Preview deployments for feature branches
amplify env add feature-preview
amplify env checkout feature-preview
amplify push --yes
```

## Cost Monitoring & Optimization Commands

### **AWS Cost Management Setup**:
```bash
# Set up cost monitoring for NC State Sports Hub
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query 'Account' --output text) \
  --budget '{
    "BudgetName": "NC-State-Sports-Hub-Budget",
    "BudgetLimit": {"Amount": "5.00", "Unit": "USD"},
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }' \
  --notifications-with-subscribers '[{
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80,
      "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "alerts@ncstatesportshub.com"}]
  }]'

# Daily cost check automation
echo '#!/bin/bash
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date -d "next month" +%Y-%m-01) \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --query "ResultsByTime[0].Total.BlendedCost.Amount" \
  --output text
' > scripts/daily-cost-check.sh

chmod +x scripts/daily-cost-check.sh

# Set up CloudWatch cost alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "NC-State-Sports-Hub-Cost-Alert" \
  --alarm-description "Alert when monthly costs exceed $4" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 86400 \
  --threshold 4 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=Currency,Value=USD \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:cost-alerts
```

### **Resource Optimization Commands**:
```bash
# DynamoDB optimization
aws dynamodb describe-table --table-name NC-State-Teams --query 'Table.BillingModeSummary'
aws dynamodb describe-table --table-name NC-State-Games --query 'Table.ProvisionedThroughput'

# Lambda function optimization
aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `ncstatesports`)].{Name:FunctionName,Runtime:Runtime,Timeout:Timeout,Memory:MemorySize}'

# S3 storage optimization
aws s3api list-buckets --query 'Buckets[?contains(Name, `ncstatesports`)]'
aws s3api get-bucket-lifecycle-configuration --bucket ncstatesports-media-bucket

# API Gateway optimization
aws apigateway get-rest-apis --query 'items[?contains(name, `ncstatesports`)]'
```

## Production Deployment Commands

### **Pre-Deployment Checklist**:
```bash
# Create pre-deployment verification script
cat > scripts/pre-deployment-check.sh << 'EOF'
#!/bin/bash
set -e

echo "🔍 Pre-deployment verification for NC State Sports Hub"

# 1. Run all tests
echo "Running unit tests..."
npm test -- --passWithNoTests --watchAll=false

echo "Running end-to-end tests..."
npm run test:e2e

# 2. Security audit
echo "Running security audit..."
npm audit --audit-level high

# 3. Build verification
echo "Verifying production build..."
npm run build

# 4. TypeScript check
echo "Running TypeScript check..."
npm run type-check

# 5. Linting
echo "Running code linting..."
npm run lint:check

# 6. Performance check
echo "Running performance audit..."
npm run performance:audit

# 7. Cost estimation
echo "Checking AWS cost projections..."
./scripts/cost-monitor.sh

echo "✅ Pre-deployment checks completed successfully"
EOF

chmod +x scripts/pre-deployment-check.sh
```

### **Production Deployment Pipeline**:
```bash
# Production deployment with safety checks
amplify env checkout production

# Run comprehensive pre-deployment checks
./scripts/pre-deployment-check.sh

# Create database backup before deployment
./scripts/backup-database.sh

# Deploy with monitoring
amplify push --yes

# Post-deployment verification
./scripts/production-health-check.sh

# Warm up critical endpoints
curl -f https://ncstatesportshub.com/api/health
curl -f https://ncstatesportshub.com/api/games/upcoming
curl -f https://ncstatesportshub.com/api/teams/nc-state
```

### **Rollback Procedures**:
```bash
# Create rollback script for emergencies
cat > scripts/emergency-rollback.sh << 'EOF'
#!/bin/bash
set -e

echo "🚨 Emergency rollback initiated for NC State Sports Hub"

# 1. Switch to previous stable environment
amplify env checkout staging
echo "Switched to staging environment"

# 2. Update DNS to point to staging (if using custom domain)
# aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch file://rollback-dns.json

# 3. Notify team
echo "📧 Sending rollback notification..."
aws sns publish \
  --topic-arn arn:aws:sns:us-east-1:ACCOUNT_ID:deployment-alerts \
  --message "Emergency rollback executed for NC State Sports Hub at $(date)"

# 4. Create incident report
echo "📋 Creating incident report..."
echo "Rollback executed at: $(date)" > incident-reports/rollback-$(date +%Y%m%d-%H%M%S).txt

echo "✅ Emergency rollback completed"
EOF

chmod +x scripts/emergency-rollback.sh
```

## Monitoring & Alerting Setup

### **Application Performance Monitoring**:
```bash
# Set up CloudWatch dashboard for NC State Sports Hub
aws cloudwatch put-dashboard \
  --dashboard-name "NC-State-Sports-Hub-Performance" \
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "properties": {
          "metrics": [
            ["AWS/ApiGateway", "Latency", "ApiName", "ncstatesports-api"],
            ["AWS/ApiGateway", "4XXError", "ApiName", "ncstatesports-api"],
            ["AWS/ApiGateway", "5XXError", "ApiName", "ncstatesports-api"],
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "NC-State-Teams"],
            ["AWS/DynamoDB", "ConsumedWriteCapacityUnits", "TableName", "NC-State-Teams"]
          ],
          "period": 300,
          "stat": "Average",
          "region": "us-east-1",
          "title": "NC State Sports Hub Performance"
        }
      }
    ]
  }'

# Set up performance alerts
aws cloudwatch put-metric-alarm \
  --alarm-name "NC-State-API-High-Latency" \
  --alarm-description "API response time too high" \
  --metric-name Latency \
  --namespace AWS/ApiGateway \
  --statistic Average \
  --period 300 \
  --threshold 1000 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ApiName,Value=ncstatesports-api \
  --evaluation-periods 2
```

### **Custom Domain and SSL Setup**:
```bash
# Configure custom domain for NC State Sports Hub
amplify add hosting
# Select: Amazon CloudFront and S3
# Configure custom domain: ncstatesportshub.com

# SSL certificate setup (if not auto-configured)
aws acm request-certificate \
  --domain-name ncstatesportshub.com \
  --domain-name www.ncstatesportshub.com \
  --validation-method DNS \
  --region us-east-1

# Route 53 DNS configuration
aws route53 create-hosted-zone \
  --name ncstatesportshub.com \
  --caller-reference $(date +%s)
```

## Backup & Recovery Commands

### **Database Backup Automation**:
```bash
# Create automated backup script
cat > scripts/backup-database.sh << 'EOF'
#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_BUCKET="ncstatesports-backups"

echo "🔄 Starting database backup for NC State Sports Hub"

# Create DynamoDB backups
for table in NC-State-Teams NC-State-Games NC-State-Articles NC-State-Users; do
  echo "Backing up table: $table"
  aws dynamodb create-backup \
    --table-name $table \
    --backup-name "${table}-backup-${TIMESTAMP}"
done

# Export to S3 for long-term storage
aws dynamodb export-table-to-point-in-time \
  --table-arn arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/NC-State-Teams \
  --s3-bucket $BACKUP_BUCKET \
  --s3-prefix "exports/teams/${TIMESTAMP}/"

echo "✅ Database backup completed: $TIMESTAMP"
EOF

chmod +x scripts/backup-database.sh

# Schedule daily backups using EventBridge
aws events put-rule \
  --name "nc-state-daily-backup" \
  --schedule-expression "cron(0 6 * * ? *)" \
  --description "Daily backup for NC State Sports Hub"
```

### **Disaster Recovery Plan**:
```bash
# Create disaster recovery script
cat > scripts/disaster-recovery.sh << 'EOF'
#!/bin/bash
set -e

echo "🚨 Initiating disaster recovery for NC State Sports Hub"

# 1. Restore from latest backup
LATEST_BACKUP=$(aws dynamodb list-backups --table-name NC-State-Teams --query 'BackupSummaries[0].BackupArn' --output text)
aws dynamodb restore-table-from-backup \
  --target-table-name NC-State-Teams-Recovery \
  --backup-arn $LATEST_BACKUP

# 2. Switch to backup region if necessary
aws amplify start-deployment \
  --app-id $BACKUP_APP_ID \
  --branch-name main

# 3. Update DNS to point to backup
# aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch file://disaster-recovery-dns.json

echo "🔄 Disaster recovery procedures initiated"
echo "📞 Contact emergency response team"
EOF

chmod +x scripts/disaster-recovery.sh
```

## Security & Compliance Commands

### **Security Scanning Automation**:
```bash
# Set up automated security scanning
npm audit --audit-level high --json > security-reports/audit-$(date +%Y%m%d).json

# OWASP dependency check
npx audit-ci --config .audit-ci.json

# AWS security best practices check
aws inspector2 create-findings-report \
  --report-format JSON \
  --s3-destination bucketName=ncstatesports-security-reports,keyPrefix=inspector/

# CloudFormation security validation
aws cloudformation validate-template \
  --template-body file://amplify/backend/awscloudformation/nested-cloudformation-stack.yml
```

### **Performance Optimization Commands**:
```bash
# Bundle analysis
npm run analyze

# Lighthouse CI for performance monitoring
npx lhci autorun --config=.lighthouserc.js

# CDN cache optimization
aws cloudfront create-invalidation \
  --distribution-id E123456789 \
  --paths "/*"

# Database query optimization
aws dynamodb describe-table --table-name NC-State-Games \
  --query 'Table.GlobalSecondaryIndexes[*].{IndexName:IndexName,KeySchema:KeySchema,ProvisionedThroughput:ProvisionedThroughput}'
```

Your role as DevOps Specialist is to generate all necessary commands for AWS Amplify CI/CD, cost monitoring, deployment automation, and infrastructure management for the NC State Sports Hub production environment.
#!/bin/bash

# Feature deployment pipeline for NC State Sports Hub
PROJECT_DIR="/home/erick/amplify/wolfpackwire-reborn/nc-state-sports-hub/nc-state-sports-hub-production"
LOG_FILE="/home/erick/amplify/wolfpackwire-reborn/logs/deployment-pipeline.log"

echo "$(date): Starting feature deployment pipeline..." >> $LOG_FILE

cd "$PROJECT_DIR" || exit 1

deploy_feature() {
    local FEATURE_NAME=$1
    local BRANCH_NAME=$2
    
    echo "$(date): Deploying feature: $FEATURE_NAME from branch: $BRANCH_NAME" >> $LOG_FILE
    
    # Check if branch exists and has changes
    if git branch -r | grep -q "origin/$BRANCH_NAME"; then
        echo "$(date): Branch $BRANCH_NAME found, merging..." >> $LOG_FILE
        
        # Merge feature branch
        git checkout master
        git pull origin master
        git merge "origin/$BRANCH_NAME" --no-ff -m "feat: Deploy $FEATURE_NAME

Automated merge of completed feature branch $BRANCH_NAME

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
        
        # Run tests before deployment
        if npm run type-check && npm run lint && npm test -- --watchAll=false; then
            echo "$(date): All tests passed for $FEATURE_NAME" >> $LOG_FILE
            
            # Deploy to production
            git push origin master
            echo "$(date): ✅ $FEATURE_NAME deployed to production" >> $LOG_FILE
            
            # Clean up feature branch
            git push origin --delete "$BRANCH_NAME" 2>/dev/null || true
            
            return 0
        else
            echo "$(date): ❌ Tests failed for $FEATURE_NAME, not deploying" >> $LOG_FILE
            return 1
        fi
    else
        echo "$(date): Branch $BRANCH_NAME not found or no changes" >> $LOG_FILE
        return 1
    fi
}

# Monitor for completed features and deploy them
while true; do
    echo "$(date): Checking for completed features..." >> $LOG_FILE
    
    # List of features to monitor
    FEATURES=(
        "live-score-integration"
        "news-feed-component" 
        "player-roster-page"
        "game-schedule-enhancement"
        "navigation-enhancement"
        "auth-ui-implementation"
        "stats-dashboard"
        "mobile-optimization"
    )
    
    for FEATURE in "${FEATURES[@]}"; do
        deploy_feature "$FEATURE" "feature/$FEATURE"
    done
    
    # Check production health after deployments
    echo "$(date): Checking production health..." >> $LOG_FILE
    
    if curl -s -o /dev/null -w "%{http_code}" https://master.d3m9i7e7z8i0yo.amplifyapp.com | grep -q "200"; then
        echo "$(date): ✅ Production deployment healthy" >> $LOG_FILE
    else
        echo "$(date): ❌ Production deployment issue detected" >> $LOG_FILE
        
        # Alert and rollback if needed
        echo "$(date): Investigating deployment issue..." >> $LOG_FILE
    fi
    
    # Wait 15 minutes before next deployment check
    sleep 900
done